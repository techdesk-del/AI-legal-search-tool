// searchEngine.js - Hybrid Semantic & Vector-Style Legal Search Engine with Citation Synthesizer
require('dotenv').config();
const dataStore = require('./dataStore');

let GoogleGenAI = null;
try {
  GoogleGenAI = require('@google/genai').GoogleGenAI;
} catch (e) {
  GoogleGenAI = null;
}

let geminiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    return null;
  }
  if (!geminiClient && GoogleGenAI) {
    geminiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
  }
  return geminiClient;
}

// Common English & Generic Legal Stopwords
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'tell',
  'show', 'give', 'explain', 'detail', 'provide', 'please', 'is', 'are', 'find', 'get', 'laws',
  'law', 'legal', 'query', 'test', 'unknown', 'provision', 'provisions', 'document', 'documents'
]);

// Legal synonyms expansion
const LEGAL_SYNONYMS = {
  'terminate': ['retrench', 'discharge', 'dismiss', 'termination', 'fire', 'notice period'],
  'termination': ['retrenchment', 'dismissal', 'discharge', 'severance', 'resignation'],
  'notice': ['notice period', 'one month', '60 days', 'written notice', 'prior notice'],
  'retrenchment': ['severance', 'termination', 'compensation', 'section 25F', 'workman'],
  'privacy': ['fundamental right', 'article 21', 'puttaswamy', 'personal data', 'surveillance'],
  'offensive': ['section 66A', 'shreya singhal', 'unconstitutional', 'speech', 'social media'],
  'harassment': ['posh', 'icc', 'internal complaints committee', 'sexual harassment', '90 days'],
  'posh': ['internal complaints committee', 'icc', 'sexual harassment', 'workplace committee', 'section 4'],
  'noncompete': ['non-compete', 'restraint of trade', 'section 27', 'restrictive covenant', 'percept d\'mark'],
  'non-compete': ['restraint of trade', 'section 27', 'restrictive covenant', 'void agreement'],
  'csr': ['corporate social responsibility', 'section 135', '2 percent', 'net profit'],
  'evidence': ['electronic evidence', 'section 65B', 'digital record', 'certificate', 'whatsapp'],
  'whatsapp': ['electronic evidence', 'section 65B', 'screenshot', 'admissibility', 'digital record'],
  'video': ['youtube', 'lecture', 'webinar', 'timestamp'],
  'dpdp': ['digital personal data protection', 'data protection', 'penalty', 'data breach']
};

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

function expandQueryTokens(tokens) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    if (LEGAL_SYNONYMS[token]) {
      for (const syn of LEGAL_SYNONYMS[token]) {
        for (const word of tokenize(syn)) {
          expanded.add(word);
        }
      }
    }
  }
  return Array.from(expanded);
}

function calculateScore(queryTokens, doc, chunk, rawTokens) {
  let score = 0;
  const chunkText = `${chunk.section || ''} ${chunk.heading || ''} ${chunk.content || ''} ${(chunk.tags || []).join(' ')}`.toLowerCase();
  const docText = `${doc.title || ''} ${doc.category || ''} ${doc.summary || ''} ${doc.court || ''}`.toLowerCase();

  let matchedDistinctRawTokens = 0;
  for (const rawToken of rawTokens) {
    if (chunkText.includes(rawToken) || docText.includes(rawToken)) {
      matchedDistinctRawTokens++;
    }
  }

  for (const token of queryTokens) {
    // Exact token in chunk heading / section (High weight)
    if ((chunk.section && chunk.section.toLowerCase().includes(token)) ||
        (chunk.heading && chunk.heading.toLowerCase().includes(token))) {
      score += 4.5;
    }

    // Exact token in chunk tags (High weight)
    if (chunk.tags && chunk.tags.some(t => t.toLowerCase().includes(token))) {
      score += 4.0;
    }

    // Exact token in chunk content
    const regex = new RegExp(`\\b${token}\\b`, 'gi');
    const matches = (chunkText.match(regex) || []).length;
    score += Math.min(matches * 1.5, 6.0);

    // Exact token in document title / category
    if (docText.includes(token)) {
      score += 1.8;
    }
  }

  // Bonus for matching multi-word phrases from query
  const queryPhrase = queryTokens.slice(0, 4).join(' ');
  if (queryPhrase.length > 5 && chunkText.includes(queryPhrase)) {
    score += 5.0;
  }

  return { score, matchedDistinctRawTokens };
}

function synthesizeAnswer(query, matchedChunks, confidenceScore) {
  if (!matchedChunks || matchedChunks.length === 0 || confidenceScore < 0.35) {
    return {
      text: `Based on the legal knowledge base currently indexed, there is no high-confidence statutory provision, precedent, or video segment directly answering: "${query}". This query has been automatically routed to the Legal Admin Desk for official review and document indexing.`,
      isDirectAnswer: false
    };
  }

  const topChunk = matchedChunks[0];
  const topDoc = topChunk.document;

  let synthesis = "";

  if (topDoc.docType === 'Act') {
    synthesis = `Under **${topDoc.title}** (${topChunk.chunk.section || 'General Provision'}), ${topChunk.chunk.heading}: ${topChunk.chunk.content}`;
  } else if (topDoc.docType === 'Judgement') {
    synthesis = `In the landmark ruling **${topDoc.title}** (${topDoc.citationRef || topDoc.year}), the Supreme Court held: ${topChunk.chunk.content}`;
  } else if (topDoc.docType === 'YouTube Video') {
    synthesis = `According to the expert video analysis in **${topDoc.title}** at timestamp **${topChunk.chunk.timestampDisplay || '00:00'}**: ${topChunk.chunk.content}`;
  } else if (topDoc.docType === 'Contract') {
    synthesis = `Pursuant to **${topDoc.title}** (${topChunk.chunk.section}): ${topChunk.chunk.content}`;
  } else if (topDoc.docType === 'Administrative Clarification') {
    synthesis = `**Legal Admin Verified Guidance**: ${topChunk.chunk.content}`;
  } else {
    synthesis = `According to **${topDoc.title}** (${topChunk.chunk.section || 'Section'}): ${topChunk.chunk.content}`;
  }

  // If there is a second corroborating chunk, append relevant synthesis
  if (matchedChunks.length > 1 && matchedChunks[1].score > 3.0) {
    const secondChunk = matchedChunks[1];
    synthesis += `\n\nAdditionally, reference is made to **${secondChunk.document.title}** (${secondChunk.chunk.section || secondChunk.chunk.heading}): ${secondChunk.chunk.content.substring(0, 220)}...`;
  }

  return {
    text: synthesis,
    isDirectAnswer: true
  };
}

async function synthesizeWithGemini(query, matchedChunks) {
  const ai = getGeminiClient();
  if (!ai || !matchedChunks || matchedChunks.length === 0) return null;

  try {
    const context = matchedChunks.slice(0, 4).map((m, idx) => {
      return `[Authority ${idx + 1}] Document: ${m.document.title} (${m.document.docType})
Section/Clause: ${m.chunk.section || ''} ${m.chunk.heading ? `- ${m.chunk.heading}` : ''}
Excerpt: ${m.chunk.content}
${m.chunk.timestampDisplay ? `Video Timestamp: ${m.chunk.timestampDisplay}` : ''}
${m.document.isSuperseded ? `Alert: Superseded / Struck Down (${m.document.supersededBy})` : ''}`;
    }).join('\n\n');

    const prompt = `You are a Senior Legal Counsel AI Assistant specializing in Indian Law (Statutory Acts, Supreme Court Precedents, Corporate Agreements, and Legal Lectures).

A corporate user has asked the following legal question:
"${query}"

Here are the authoritative statutory provisions, court judgements, and transcripts retrieved from the verified Legal Knowledge Base:
--------------------------------
${context}
--------------------------------

Instructions:
1. Provide a direct, authoritative, and lawyer-grade legal synthesis answering the user's question based on the retrieved authorities above.
2. Explicitly cite the specific Sections, Acts, or Case Laws (e.g. "**Industrial Disputes Act, 1947 (Section 25F)**").
3. If a YouTube video lecture is cited, mention the exact timestamp (e.g. "**Timestamp 08:20**").
4. If a provision is marked as superseded or struck down by the Supreme Court (e.g. **Section 66A IT Act**), highlight that it is no longer enforceable law.
5. Format the response clearly with bold highlights and concise paragraphs.
6. If the retrieved authority is an Administrative Clarification or Admin Directive, include the exact verified directive text verbatim in your answer.
7. Do not fabricate or hallucinate any statutory provisions outside the provided context.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    if (response && response.text) {
      return {
        text: response.text,
        isDirectAnswer: true,
        source: 'Google Gemini 2.5 Live Real-Time AI'
      };
    }
  } catch (err) {
    console.error('Gemini real-time synthesis error, falling back to local synthesizer:', err.message);
  }
  return null;
}

function getRelatedSuggestions(query, topDoc) {
  const suggestions = [];
  const q = query.toLowerCase();

  if (q.includes('retrench') || q.includes('terminate') || q.includes('notice')) {
    suggestions.push("What is the severance compensation formula under Section 25F?");
    suggestions.push("How much advance notice is required before factory closure under Section 25FFA?");
    suggestions.push("Are post-employment non-compete clauses valid under Indian Contract Act?");
  } else if (q.includes('66a') || q.includes('it act') || q.includes('speech') || q.includes('offensive')) {
    suggestions.push("Why was Section 66A IT Act struck down in Shreya Singhal v. UOI?");
    suggestions.push("What are the mandatory conditions for electronic evidence under Section 65B?");
    suggestions.push("What is intermediary liability under Section 79 of the IT Act?");
  } else if (q.includes('posh') || q.includes('harassment') || q.includes('icc') || q.includes('women')) {
    suggestions.push("What is the quorum and composition of Internal Complaints Committee under POSH?");
    suggestions.push("What is the 3-month limitation period for filing a POSH complaint?");
    suggestions.push("What is the 90-day inquiry procedure for workplace harassment?");
  } else if (q.includes('privacy') || q.includes('puttaswamy') || q.includes('data')) {
    suggestions.push("What is the threefold proportionality test in Puttaswamy judgement?");
    suggestions.push("What is body corporate liability under Section 43A for data breaches?");
    suggestions.push("Right to Privacy as a fundamental right under Article 21");
  } else {
    suggestions.push("What is the mandatory CSR spend required under Companies Act 2013?");
    suggestions.push("Conditions for valid liquidated damages under Section 74 Indian Contract Act");
    suggestions.push("Admissibility of WhatsApp chat screenshots in legal proceedings");
  }

  return suggestions;
}

async function executeSearch(query, filters = {}, userRole = 'Employee', userId = 'emp_current') {
  if (!query || query.trim() === '') {
    return {
      query: '',
      resultsCount: 0,
      confidenceScore: 0,
      confidenceTier: 'None',
      answer: { text: 'Please enter a natural language legal question.', isDirectAnswer: false },
      citations: [],
      relatedQueries: [],
      routedToAdmin: false
    };
  }

  const rawTokens = tokenize(query);
  const searchTokens = expandQueryTokens(rawTokens);
  const docs = dataStore.getDocuments(userRole);

  const matchedChunks = [];

  for (const doc of docs) {
    // Check filters
    if (filters.docType && filters.docType !== 'All' && doc.docType !== filters.docType) {
      continue;
    }
    if (filters.jurisdiction && filters.jurisdiction !== 'All' && doc.jurisdiction !== filters.jurisdiction) {
      continue;
    }
    if (filters.category && filters.category !== 'All' && doc.category !== filters.category) {
      continue;
    }
    if (filters.yearFrom && doc.year < parseInt(filters.yearFrom, 10)) {
      continue;
    }
    if (filters.yearTo && doc.year > parseInt(filters.yearTo, 10)) {
      continue;
    }

    // Evaluate each chunk
    for (const chunk of doc.chunks || []) {
      const { score, matchedDistinctRawTokens } = calculateScore(searchTokens, doc, chunk, rawTokens);
      // Require at least minimal substantive match
      if (score >= 2.5 && (rawTokens.length === 0 || matchedDistinctRawTokens >= 1)) {
        matchedChunks.push({
          score,
          matchedDistinctRawTokens,
          document: {
            id: doc.id,
            title: doc.title,
            docType: doc.docType,
            jurisdiction: doc.jurisdiction,
            court: doc.court,
            year: doc.year,
            category: doc.category,
            status: doc.status,
            confidentiality: doc.confidentiality,
            sourceUrl: doc.sourceUrl,
            videoDuration: doc.videoDuration,
            isSuperseded: doc.isSuperseded,
            supersededBy: doc.supersededBy,
            citationRef: doc.citationRef
          },
          chunk: {
            id: chunk.id,
            section: chunk.section,
            heading: chunk.heading,
            content: chunk.content,
            timestampSeconds: chunk.timestampSeconds,
            timestampDisplay: chunk.timestampDisplay,
            tags: chunk.tags
          }
        });
      }
    }
  }

  // Sort descending by score
  matchedChunks.sort((a, b) => b.score - a.score);

  // Calculate normalized confidence score (0.0 to 1.0)
  let confidenceScore = 0.0;
  if (matchedChunks.length > 0) {
    const top = matchedChunks[0];
    const topScore = top.score;
    const distinctRatio = rawTokens.length > 0 ? (top.matchedDistinctRawTokens / rawTokens.length) : 1;

    if (topScore >= 8.0 && distinctRatio >= 0.5) {
      confidenceScore = Math.min(0.92 + (topScore - 8.0) * 0.015, 0.99);
    } else if (topScore >= 4.0 && distinctRatio >= 0.3) {
      confidenceScore = 0.70 + (topScore - 4.0) * 0.05;
    } else if (topScore >= 2.5 && distinctRatio >= 0.25) {
      confidenceScore = 0.45 + (topScore - 2.5) * 0.08;
    } else {
      confidenceScore = 0.20 + topScore * 0.05;
    }
  }
  confidenceScore = Math.round(confidenceScore * 100) / 100;

  // Determine Confidence Tier
  let confidenceTier = 'Low';
  let routedToAdmin = false;

  if (confidenceScore >= 0.70) {
    confidenceTier = 'High';
  } else if (confidenceScore >= 0.45) {
    confidenceTier = 'Medium';
  } else {
    confidenceTier = 'Low (Routed to Admin)';
    routedToAdmin = true;
    // Automatically route to Admin Unanswered Queue
    dataStore.addUnansweredQuestion(query, `${userId} (${userRole})`, filters.category || 'General Legal', confidenceScore);
  }

  // Build Citations
  const citations = matchedChunks.slice(0, 4).map((m, index) => ({
    citationIndex: index + 1,
    docId: m.document.id,
    docTitle: m.document.title,
    docType: m.document.docType,
    section: m.chunk.section,
    heading: m.chunk.heading,
    excerpt: m.chunk.content,
    relevanceScore: Math.round(m.score * 10) / 10,
    court: m.document.court,
    year: m.document.year,
    jurisdiction: m.document.jurisdiction,
    sourceUrl: m.document.sourceUrl,
    timestampSeconds: m.chunk.timestampSeconds,
    timestampDisplay: m.chunk.timestampDisplay,
    isSuperseded: m.document.isSuperseded,
    supersededBy: m.document.supersededBy,
    confidentiality: m.document.confidentiality
  }));

  let answer = null;
  if (confidenceScore >= 0.35 && matchedChunks.length > 0) {
    // For official Administrative Clarifications, directly output verified Lead Counsel guidance:
    if (matchedChunks[0].document.docType === 'Administrative Clarification') {
      answer = synthesizeAnswer(query, matchedChunks, confidenceScore);
    } else {
      answer = await synthesizeWithGemini(query, matchedChunks);
    }
  }
  if (!answer) {
    answer = synthesizeAnswer(query, matchedChunks, confidenceScore);
  }
  const relatedQueries = getRelatedSuggestions(query, matchedChunks[0] ? matchedChunks[0].document : null);

  // Log to Audit Trail
  dataStore.logAction({
    userId,
    userName: userRole === 'Admin' ? 'Adv. Rajesh Sharma (Lead Counsel)' : (userRole === 'Contributor' ? 'Vikas Mehra (Paralegal)' : 'Ananya Sen (Associate)'),
    userRole,
    action: routedToAdmin ? 'UNANSWERED_ESCALATION' : 'SEARCH_QUERY',
    query,
    confidenceScore,
    confidenceTier,
    citationsCount: citations.length,
    retrievedDocs: [...new Set(citations.map(c => c.docTitle))],
    ipAddress: '127.0.0.1'
  });

  return {
    query,
    resultsCount: matchedChunks.length,
    confidenceScore,
    confidenceTier,
    answer,
    citations,
    relatedQueries,
    routedToAdmin,
    disclaimer: "RESEARCH AID DISCLAIMER: This AI output is generated for legal research assistance only and does not constitute formal legal advice. Please verify exact statutory provisions, case citations, and latest judicial supersessions before relying on this analysis in legal proceedings or corporate contracts."
  };
}

module.exports = {
  executeSearch,
  tokenize,
  expandQueryTokens
};
