// app.js - Urbangaon AI Legal Search Platform Client Logic

let currentRole = 'Admin';
let currentSearchResults = null;
let currentDocuments = [];
let currentUnanswered = [];
let currentBookmarks = [];
let currentSavedSearches = [];

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  await Promise.all([
    fetchDocuments(),
    fetchUnansweredQuestions(),
    fetchAuditLogs(),
    fetchAnalytics(),
    fetchBookmarks(),
    fetchSavedSearches()
  ]);
}

// Navigation Tabs
function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `pane-${tabId}`);
  });

  if (tabId === 'admin-desk') {
    fetchUnansweredQuestions();
  } else if (tabId === 'knowledge-repo') {
    fetchDocuments();
  } else if (tabId === 'analytics-insights') {
    fetchAnalytics();
  } else if (tabId === 'audit-compliance') {
    fetchAuditLogs();
  }
}

// Role Switcher
function handleRoleChange() {
  const select = document.getElementById('userRoleSelect');
  currentRole = select.value;
  showToast(`Active role switched to: ${currentRole}`, 'info');

  const adminTab = document.getElementById('tabAdminDesk');
  const adminBadge = document.getElementById('adminNotificationBadge');

  if (currentRole === 'Employee') {
    adminTab.style.display = 'none';
    adminBadge.style.display = 'none';
  } else {
    adminTab.style.display = 'flex';
    adminBadge.style.display = 'flex';
  }

  fetchDocuments();
}

// Quick Sample Query Setter
function setQuery(text) {
  const input = document.getElementById('searchInput');
  input.value = text;
  executeSearchQuery();
}

// 1. Natural Language Search
async function executeSearchQuery() {
  const input = document.getElementById('searchInput');
  const query = input.value.trim();
  if (!query) return;

  const btnSearch = document.getElementById('btnSearchSubmit');
  btnSearch.disabled = true;
  btnSearch.innerHTML = '<span>Searching...</span> ⏳';

  const docType = document.getElementById('filterDocType').value;
  const jurisdiction = document.getElementById('filterJurisdiction').value;

  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        filters: { docType, jurisdiction },
        userRole: currentRole,
        userId: `user_${currentRole.toLowerCase()}`
      })
    });
    const json = await res.json();
    if (json.success) {
      currentSearchResults = json.data;
      renderSearchResults(json.data);
      // Refresh badge and audit logs
      fetchUnansweredQuestions();
    } else {
      showToast(`Error: ${json.error}`, 'error');
    }
  } catch (err) {
    showToast('Failed to execute search query', 'error');
  } finally {
    btnSearch.disabled = false;
    btnSearch.innerHTML = '<span>Ask AI</span> ➔';
  }
}

function renderSearchResults(data) {
  const container = document.getElementById('searchResultsContainer');
  container.style.display = 'grid';

  // AI Answer Box
  const aiAnswerBody = document.getElementById('aiAnswerBody');
  const confidenceBadge = document.getElementById('confidenceBadge');
  const confidenceText = document.getElementById('confidenceText');
  const matchStats = document.getElementById('matchStats');

  // Format bold text and paragraphs
  const formattedAnswer = data.answer.text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split('\n\n')
    .map(p => `<p>${p}</p>`)
    .join('');

  aiAnswerBody.innerHTML = formattedAnswer;

  // Confidence Tier Styling
  const pct = Math.round(data.confidenceScore * 100);
  if (data.confidenceScore >= 0.70) {
    confidenceBadge.className = 'confidence-indicator high';
    confidenceText.innerHTML = `High Confidence (${pct}%)`;
  } else if (data.confidenceScore >= 0.45) {
    confidenceBadge.className = 'confidence-indicator medium';
    confidenceText.innerHTML = `Medium Confidence (${pct}%)`;
  } else {
    confidenceBadge.className = 'confidence-indicator low';
    confidenceText.innerHTML = `⚠️ Low Confidence (${pct}%) - Routed to Admin`;
  }

  matchStats.innerText = `Verified legal sources retrieved: ${data.citations.length} authority matches`;

  // Render Citations
  const citationsList = document.getElementById('citationsList');
  citationsList.innerHTML = '';

  if (data.citations.length === 0) {
    citationsList.innerHTML = `
      <div style="background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.3); padding: 1rem; border-radius: 8px; color: #fca5a5;">
        <strong>No direct statutory or judicial citation matched this exact query.</strong><br>
        This query has been logged and escalated to the Lead Counsel Admin Desk.
      </div>
    `;
  } else {
    data.citations.forEach((c) => {
      let tagClass = 'tag-act';
      let icon = '📜';
      if (c.docType === 'Judgement') { tagClass = 'tag-case'; icon = '⚖️'; }
      else if (c.docType === 'YouTube Video') { tagClass = 'tag-video'; icon = '🎥'; }
      else if (c.docType === 'Contract') { tagClass = 'tag-contract'; icon = '📑'; }
      else if (c.docType === 'Administrative Clarification') { tagClass = 'tag-advisory'; icon = '🛡️'; }

      const card = document.createElement('div');
      card.className = 'citation-card';
      card.innerHTML = `
        <div class="citation-header">
          <div class="citation-meta">
            <span class="tag-badge ${tagClass}">${icon} ${c.docType}</span>
            <span style="color: var(--text-muted);">${c.court || c.jurisdiction} • ${c.year}</span>
            ${c.confidentiality === 'Internal' ? '<span class="tag-badge" style="background: rgba(245,158,11,0.2); color:#fbbf24;">Internal</span>' : ''}
          </div>
          <span style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 700;">Relevance Score: ${c.relevanceScore}</span>
        </div>

        <div class="citation-title">${c.docTitle}</div>
        
        <div class="citation-section-badge">
          📌 ${c.section} ${c.heading ? `- ${c.heading}` : ''}
        </div>

        ${c.isSuperseded ? `
          <div class="superseded-alert">
            ⚠️ <strong>Supersession Alert:</strong> ${c.supersededBy || 'Provision amended or struck down'}
          </div>
        ` : ''}

        <div class="citation-excerpt">
          "${c.excerpt}"
        </div>

        <div class="citation-footer">
          <span class="relevance-meter">Citation #${c.citationIndex}</span>
          <div>
            ${c.docType === 'YouTube Video' && c.timestampSeconds !== undefined ? `
              <button class="btn-inspect" style="background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.3); color:#f43f5e;" onclick='openVideoModal(${JSON.stringify(c)})'>
                ▶️ Play at Timestamp ${c.timestampDisplay}
              </button>
            ` : `
              <button class="btn-inspect" onclick='openCitationModal(${JSON.stringify(c)})'>
                🔍 Inspect Full Text
              </button>
            `}
          </div>
        </div>
      `;
      citationsList.appendChild(card);
    });
  }

  // Render Related Queries
  const relatedList = document.getElementById('relatedQueriesList');
  relatedList.innerHTML = '';
  data.relatedQueries.forEach(rq => {
    const item = document.createElement('div');
    item.className = 'related-item';
    item.innerHTML = `<span>👉</span> <span>${rq}</span>`;
    item.onclick = () => setQuery(rq);
    relatedList.appendChild(item);
  });
}

// Modals
function openModal(modalId) {
  document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('open');
  if (modalId === 'videoModal') {
    document.getElementById('videoIframe').src = '';
  }
}

function openCitationModal(citation) {
  document.getElementById('modalCitationDocTitle').innerText = citation.docTitle;
  document.getElementById('modalCitationSection').innerText = `${citation.section} ${citation.heading ? `— ${citation.heading}` : ''}`;
  document.getElementById('modalCitationContent').innerText = citation.excerpt;
  document.getElementById('modalCitationMeta').innerText = `Jurisdiction: ${citation.jurisdiction} | Court: ${citation.court} | Year: ${citation.year}`;
  openModal('citationModal');
}

function openVideoModal(citation) {
  document.getElementById('modalVideoTitle').innerText = citation.docTitle;
  document.getElementById('modalVideoTimestamp').innerText = `⏱️ Seeking to Segment: ${citation.section} (${citation.timestampDisplay})`;
  document.getElementById('modalVideoTranscriptText').innerText = citation.excerpt;

  // Generate embed URL with start timestamp
  let videoId = 'dQw4w9WgXcQ';
  if (citation.sourceUrl && citation.sourceUrl.includes('v=')) {
    videoId = citation.sourceUrl.split('v=')[1].split('&')[0];
  }
  const startSec = citation.timestampSeconds || 0;
  document.getElementById('videoIframe').src = `https://www.youtube.com/embed/${videoId}?start=${startSec}&autoplay=1`;

  openModal('videoModal');
}

// 2. Knowledge Base & Documents
async function fetchDocuments(category = 'All') {
  try {
    let url = `/api/documents?userRole=${currentRole}`;
    if (category !== 'All') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    const res = await fetch(url);
    const json = await res.json();
    if (json.success) {
      currentDocuments = json.data;
      renderDocumentsGrid(json.data);
      document.getElementById('docCountBadge').innerText = json.data.length;
      document.getElementById('repoTotalDocs').innerText = json.data.length;
      const totalChunks = json.data.reduce((sum, d) => sum + (d.chunks ? d.chunks.length : 0), 0);
      document.getElementById('repoTotalChunks').innerText = totalChunks;
    }
  } catch (err) {
    console.error('Error fetching docs:', err);
  }
}

function filterRepo(cat) {
  fetchDocuments(cat);
}

function renderDocumentsGrid(docs) {
  const grid = document.getElementById('documentsGrid');
  grid.innerHTML = '';

  docs.forEach(d => {
    let tagClass = 'tag-act';
    let icon = '📜';
    if (d.docType === 'Judgement') { tagClass = 'tag-case'; icon = '⚖️'; }
    else if (d.docType === 'YouTube Video') { tagClass = 'tag-video'; icon = '🎥'; }
    else if (d.docType === 'Contract') { tagClass = 'tag-contract'; icon = '📑'; }
    else if (d.docType === 'Administrative Clarification') { tagClass = 'tag-advisory'; icon = '🛡️'; }

    const card = document.createElement('div');
    card.className = 'doc-card';
    card.innerHTML = `
      <div class="doc-card-top">
        <div class="doc-card-meta">
          <span class="tag-badge ${tagClass}">${icon} ${d.docType}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${d.year}</span>
        </div>
        <div class="doc-card-title">${d.title}</div>
        <div class="doc-card-summary">${d.summary || 'No summary available.'}</div>
      </div>
      <div class="doc-card-bottom">
        <span class="chunks-badge">🧩 ${(d.chunks || []).length} Chunks Indexed</span>
        <button class="btn-inspect" onclick='inspectDoc(${JSON.stringify(d).replace(/'/g, "&apos;")})'>
          View Chunks
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function inspectDoc(doc) {
  document.getElementById('modalCitationDocTitle').innerText = doc.title;
  document.getElementById('modalCitationSection').innerText = `${doc.docType} • ${doc.jurisdiction} • ${doc.category}`;
  
  let contentHtml = '';
  (doc.chunks || []).forEach(ch => {
    contentHtml += `
      <div style="margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color);">
        <strong style="color: var(--accent-gold);">${ch.section} — ${ch.heading}</strong>
        <p style="margin-top: 0.35rem;">${ch.content}</p>
      </div>
    `;
  });
  
  document.getElementById('modalCitationContent').innerHTML = contentHtml || '<p>No chunks found.</p>';
  document.getElementById('modalCitationMeta').innerText = `Confidentiality: ${doc.confidentiality} | Status: ${doc.status}`;
  openModal('citationModal');
}

// Ingestion Form & File Handling
function openIngestionModal() {
  openModal('ingestionModal');
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('fileDropZone').classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  document.getElementById('fileDropZone').classList.remove('dragover');
}

function handleFileDrop(e) {
  e.preventDefault();
  document.getElementById('fileDropZone').classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processUploadedFile(e.dataTransfer.files[0]);
  }
}

function handleFileSelect(e) {
  if (e.target.files && e.target.files.length > 0) {
    processUploadedFile(e.target.files[0]);
  }
}

function processUploadedFile(file) {
  const titleInput = document.getElementById('ingestTitle');
  const rawContentArea = document.getElementById('ingestRawContent');
  const docTypeSelect = document.getElementById('ingestDocType');

  // Auto-fill Title from filename
  const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
  titleInput.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  if (cleanName.toLowerCase().includes('act')) {
    docTypeSelect.value = 'Act';
  } else if (cleanName.toLowerCase().includes('vs') || cleanName.toLowerCase().includes(' v ')) {
    docTypeSelect.value = 'Judgement';
  } else if (cleanName.toLowerCase().includes('agreement') || cleanName.toLowerCase().includes('contract') || cleanName.toLowerCase().includes('msa') || cleanName.toLowerCase().includes('nda')) {
    docTypeSelect.value = 'Contract';
  }

  showToast(`Extracting text from ${file.name}...`, 'info');

  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    if (typeof text === 'string') {
      // If it looks like raw text/markdown/json
      rawContentArea.value = text;
      showToast(`Successfully extracted ${text.length} characters from ${file.name}!`, 'success');
    } else {
      // Binary (PDF / Docx simulation / OCR extract)
      rawContentArea.value = `[Extracted OCR Content from ${file.name}]\n\nSection 1: Short Title and Commencement - This Act may be called the ${cleanName}.\n\nSection 2: Definitions and Key Provisions - In this enactment, all terms shall have the meanings assigned thereunder.\n\nSection 3: Mandatory Legal Obligations and Compliance Guidelines.`;
      showToast(`Parsed ${file.name} via OCR/Text extractor!`, 'success');
    }
  };

  if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.csv')) {
    reader.readAsText(file);
  } else {
    // For PDFs/docs read as text or binary fallback
    reader.readAsText(file);
  }
}


function toggleVideoFields() {
  const type = document.getElementById('ingestDocType').value;
  const videoGroup = document.getElementById('videoFieldsGroup');
  videoGroup.style.display = type === 'YouTube Video' ? 'grid' : 'none';
}

async function handleDocumentIngestion(e) {
  e.preventDefault();
  const title = document.getElementById('ingestTitle').value;
  const docType = document.getElementById('ingestDocType').value;
  const jurisdiction = document.getElementById('ingestJurisdiction').value;
  const category = document.getElementById('ingestCategory').value;
  const confidentiality = document.getElementById('ingestConfidentiality').value;
  const year = document.getElementById('ingestYear').value;
  const sourceUrl = document.getElementById('ingestVideoUrl').value;
  const videoDuration = document.getElementById('ingestVideoDuration').value;
  const rawContent = document.getElementById('ingestRawContent').value;
  const isSuperseded = document.getElementById('ingestSuperseded').checked;

  try {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        docType,
        jurisdiction,
        category,
        confidentiality,
        year,
        sourceUrl,
        videoDuration,
        rawContent,
        isSuperseded,
        userRole: currentRole
      })
    });
    const json = await res.json();
    if (json.success) {
      showToast('Document parsed and indexed into knowledge base!', 'success');
      closeModal('ingestionModal');
      document.getElementById('ingestForm').reset();
      fetchDocuments();
      fetchAnalytics();
      fetchAuditLogs();
    } else {
      showToast(`Ingestion error: ${json.error}`, 'error');
    }
  } catch (err) {
    showToast('Failed to ingest document', 'error');
  }
}

// 3. Admin Resolution Queue & Feedback Loop
async function fetchUnansweredQuestions() {
  try {
    const res = await fetch('/api/admin/unanswered');
    const json = await res.json();
    if (json.success) {
      currentUnanswered = json.data;
      renderUnansweredTable(json.data);
      const pendingCount = json.data.filter(q => q.status === 'Pending Review').length;
      document.getElementById('unansweredCountBadge').innerText = pendingCount;
      document.getElementById('adminPendingBadge').innerText = pendingCount;
    }
  } catch (err) {
    console.error('Error fetching unanswered queries:', err);
  }
}

function renderUnansweredTable(items) {
  const tbody = document.getElementById('unansweredTableBody');
  tbody.innerHTML = '';

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No pending unanswered questions in queue.</td></tr>`;
    return;
  }

  items.forEach(item => {
    let statusClass = 'status-pending';
    if (item.status === 'Resolved') statusClass = 'status-resolved';
    else if (item.status === 'Dismissed') statusClass = 'status-dismissed';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="freq-badge">🔥 ${item.frequency || 1}x Asked</span></td>
      <td>
        <strong>${item.query}</strong><br>
        <small style="color: var(--text-muted);">Asked by: ${item.askedBy || 'Associate'}</small>
      </td>
      <td>${item.category || 'General Legal'}</td>
      <td>${new Date(item.firstAskedAt).toLocaleDateString()}</td>
      <td><span class="status-badge ${statusClass}">${item.status}</span></td>
      <td>
        ${item.status === 'Pending Review' ? `
          <button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick='openResolveModal(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
            🛡️ Resolve & Feed KB
          </button>
        ` : `
          <small style="color: var(--accent-emerald);">✔ Resolved</small>
        `}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openResolveModal(item) {
  document.getElementById('resolveQuestionId').value = item.id;
  document.getElementById('resolveQueryText').innerText = item.query;
  document.getElementById('resolveAdminAnswer').value = '';
  openModal('resolveModal');
}

async function handleResolveSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('resolveQuestionId').value;
  const adminAnswer = document.getElementById('resolveAdminAnswer').value;
  const addToKnowledgeBase = document.getElementById('resolveAddToKb').checked;

  try {
    const res = await fetch(`/api/admin/unanswered/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminAnswer, addToKnowledgeBase })
    });
    const json = await res.json();
    if (json.success) {
      showToast('Question resolved and knowledge base dynamically updated!', 'success');
      closeModal('resolveModal');
      fetchUnansweredQuestions();
      fetchDocuments();
      fetchAnalytics();
      fetchAuditLogs();
    } else {
      showToast(`Error: ${json.error}`, 'error');
    }
  } catch (err) {
    showToast('Failed to resolve question', 'error');
  }
}

// 4. Analytics
async function fetchAnalytics() {
  try {
    const res = await fetch('/api/analytics');
    const json = await res.json();
    if (json.success) {
      const d = json.data;
      document.getElementById('statTotalQueries').innerText = d.totalQueriesLogged;
      document.getElementById('statAvgConfidence').innerText = `${Math.round(d.avgConfidenceScore * 100)}%`;
      document.getElementById('statPendingUnanswered').innerText = d.pendingUnansweredQueries;
      document.getElementById('statResolvedFeedback').innerText = d.resolvedFeedbackItems;

      // Category bars
      const catContainer = document.getElementById('categoryDistributionBars');
      catContainer.innerHTML = '';
      const totalDocs = Object.values(d.categoryCounts).reduce((a, b) => a + b, 0) || 1;
      for (const [cat, count] of Object.entries(d.categoryCounts)) {
        const pct = Math.round((count / totalDocs) * 100);
        catContainer.innerHTML += `
          <div class="bar-item">
            <div class="bar-meta">
              <span>${cat}</span>
              <strong>${count} docs (${pct}%)</strong>
            </div>
            <div class="bar-track">
              <div class="bar-fill gold" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }

      // Confidence bars
      const confContainer = document.getElementById('confidenceDistributionBars');
      confContainer.innerHTML = `
        <div class="bar-item">
          <div class="bar-meta">
            <span>High Confidence Queries (>=70%)</span>
            <strong>${d.confidenceDistribution.high} queries</strong>
          </div>
          <div class="bar-track"><div class="bar-fill emerald" style="width: 78%;"></div></div>
        </div>
        <div class="bar-item">
          <div class="bar-meta">
            <span>Medium Confidence Queries (45-69%)</span>
            <strong>${d.confidenceDistribution.medium} queries</strong>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width: 15%;"></div></div>
        </div>
        <div class="bar-item">
          <div class="bar-meta">
            <span>Low Confidence / Admin Escalated</span>
            <strong>${d.confidenceDistribution.lowOrEscalated} queries</strong>
          </div>
          <div class="bar-track"><div class="bar-fill rose" style="width: 7%;"></div></div>
        </div>
      `;
    }
  } catch (err) {
    console.error('Error fetching analytics:', err);
  }
}

// 5. Compliance Audit Logs
async function fetchAuditLogs() {
  try {
    const res = await fetch('/api/audit-logs');
    const json = await res.json();
    if (json.success) {
      renderAuditTable(json.data);
    }
  } catch (err) {
    console.error('Error fetching audit logs:', err);
  }
}

function renderAuditTable(logs) {
  const tbody = document.getElementById('auditTableBody');
  tbody.innerHTML = '';

  logs.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><small style="color: var(--text-muted);">${new Date(l.timestamp).toLocaleTimeString()} ${new Date(l.timestamp).toLocaleDateString()}</small></td>
      <td><strong>${l.userName}</strong><br><small style="color: var(--accent-gold);">${l.userRole}</small></td>
      <td><span class="tag-badge ${l.action.includes('UNANSWERED') ? 'tag-video' : 'tag-act'}">${l.action}</span></td>
      <td>${l.query}</td>
      <td>${l.confidenceTier || 'N/A'}</td>
      <td><small>${(l.retrievedDocs || []).join(', ') || 'None'}</small></td>
      <td><small style="font-family: monospace;">${l.ipAddress || '127.0.0.1'}</small></td>
    `;
    tbody.appendChild(tr);
  });
}

// 6. Bookmarks & Saved Searches
async function fetchBookmarks() {
  try {
    const res = await fetch('/api/bookmarks');
    const json = await res.json();
    if (json.success) {
      currentBookmarks = json.data;
      renderSavedItems();
    }
  } catch (err) {}
}

async function fetchSavedSearches() {
  try {
    const res = await fetch('/api/saved-searches');
    const json = await res.json();
    if (json.success) {
      currentSavedSearches = json.data;
      renderSavedItems();
    }
  } catch (err) {}
}

function renderSavedItems() {
  const list = document.getElementById('savedItemsList');
  list.innerHTML = '';

  currentBookmarks.forEach(b => {
    list.innerHTML += `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.8rem;">
        <span style="color: var(--accent-gold);">📌 ${b.title || b.section}</span><br>
        <small style="color: var(--text-muted);">${b.docTitle || ''}</small>
      </div>
    `;
  });

  currentSavedSearches.forEach(s => {
    list.innerHTML += `
      <div style="background: rgba(58,134,255,0.05); border: 1px solid rgba(58,134,255,0.2); padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.8rem; cursor: pointer;" onclick="setQuery('${s.query.replace(/'/g, "\\'")}')">
        <span style="color: #60a5fa;">🔍 "${s.query}"</span>
      </div>
    `;
  });
}

async function bookmarkTopCitation() {
  if (!currentSearchResults || currentSearchResults.citations.length === 0) return;
  const top = currentSearchResults.citations[0];
  try {
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `${top.section} - ${top.docTitle}`,
        docTitle: top.docTitle,
        section: top.section,
        excerpt: top.excerpt
      })
    });
    showToast('Citation bookmarked to your research vault!', 'success');
    fetchBookmarks();
  } catch (err) {}
}

async function saveCurrentSearch() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return;
  try {
    await fetch('/api/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q })
    });
    showToast('Search query saved for future reference!', 'success');
    fetchSavedSearches();
  } catch (err) {}
}

function copyAnswerText() {
  if (!currentSearchResults) return;
  navigator.clipboard.writeText(currentSearchResults.answer.text);
  showToast('AI Synthesis copied to clipboard!', 'success');
}

function exportResearchBrief() {
  if (!currentSearchResults) {
    showToast('Please perform a search query first to generate a brief.', 'info');
    return;
  }

  const container = document.getElementById('briefContent');
  container.innerHTML = `
    <div style="text-align: center; border-bottom: 2px solid #1a202c; padding-bottom: 1rem; margin-bottom: 1.5rem;">
      <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem;">URBANGAON AI LEGAL INTELLIGENCE BRIEF</h2>
      <p style="font-size: 0.9rem; color: #4a5568;">Generated for: ${currentRole} | Date: ${new Date().toLocaleDateString()}</p>
    </div>

    <h3 style="font-size: 1.15rem; color: #2d3748; margin-bottom: 0.5rem;">1. RESEARCH INQUIRY</h3>
    <p style="background: #f7fafc; padding: 0.75rem; border-left: 3px solid #3182ce; margin-bottom: 1.25rem;">"${currentSearchResults.query}"</p>

    <h3 style="font-size: 1.15rem; color: #2d3748; margin-bottom: 0.5rem;">2. AI LEGAL SYNTHESIS & OPINION</h3>
    <p style="margin-bottom: 1.25rem;">${currentSearchResults.answer.text.replace(/\n\n/g, '<br><br>')}</p>

    <h3 style="font-size: 1.15rem; color: #2d3748; margin-bottom: 0.5rem;">3. DIRECT STATUTORY & JUDICIAL AUTHORITIES</h3>
    <ol style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
      ${currentSearchResults.citations.map(c => `
        <li style="margin-bottom: 0.75rem;">
          <strong>${c.docTitle}</strong> (${c.section}) [${c.court || c.jurisdiction}, ${c.year}]<br>
          <em>"${c.excerpt}"</em>
        </li>
      `).join('')}
    </ol>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 0.75rem; font-size: 0.8rem; color: #718096;">
      <strong>Disclaimer:</strong> ${currentSearchResults.disclaimer}
    </div>
  `;

  openModal('exportModal');
}

// Toast System
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') toast.style.borderLeftColor = 'var(--accent-rose)';
  else if (type === 'info') toast.style.borderLeftColor = 'var(--accent-blue)';
  
  toast.innerText = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
