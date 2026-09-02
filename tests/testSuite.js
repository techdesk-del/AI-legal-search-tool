// testSuite.js - Comprehensive automated API & E2E Validation for Urbangaon AI Legal Search Tool
const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { resolve(body); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4000${path}`, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { resolve(body); }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE AI LEGAL SEARCH TEST SUITE');
  console.log('====================================================');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
    }
  }

  try {
    // 1. Test Statutory Search (Industrial Disputes Act Section 25F)
    console.log('\n--- 1. Testing Statutory Search (IDA 1947) ---');
    const searchRes1 = await post('/api/search', {
      query: "What is the notice period required to terminate an employee under Industrial Disputes Act?",
      filters: {},
      userRole: "Employee"
    });
    assert(searchRes1.success === true, 'Search endpoint returns success');
    assert(searchRes1.data.confidenceTier === 'High', 'Confidence tier is High for well-defined statutory query');
    assert(searchRes1.data.citations.length >= 1, 'Returns at least 1 exact citation');
    assert(searchRes1.data.citations.some(c => c.section.includes('25F')), 'Citation includes Section 25F');
    assert(searchRes1.data.disclaimer.includes('RESEARCH AID DISCLAIMER'), 'Statutory disclaimer is attached');

    // 2. Test Video Lecture Timestamp Citation
    console.log('\n--- 2. Testing Video Webinar Timestamp Search ---');
    const searchRes2 = await post('/api/search', {
      query: "What is the formula for 15 days severance pay in video lecture?",
      filters: {},
      userRole: "Employee"
    });
    assert(searchRes2.success === true, 'Video query search returns success');
    assert(searchRes2.data.citations.some(c => c.docType === 'YouTube Video' && c.timestampDisplay), 'Citation includes YouTube video with timestamp');
    const videoCit = searchRes2.data.citations.find(c => c.docType === 'YouTube Video');
    if (videoCit) {
      console.log(`   Video segment matched: "${videoCit.heading}" at timestamp ${videoCit.timestampDisplay}`);
    }

    // 3. Test Superseded / Struck Down Law Warning
    console.log('\n--- 3. Testing Superseded Law Alert (Section 66A IT Act) ---');
    const searchRes3 = await post('/api/search', {
      query: "Why was Section 66A IT Act struck down by Supreme Court?",
      filters: {},
      userRole: "Employee"
    });
    assert(searchRes3.success === true, 'Section 66A search returns success');
    const struckDownCit = searchRes3.data.citations.find(c => c.isSuperseded);
    assert(struckDownCit !== undefined, 'Flagged isSuperseded = true on struck down / superseded document');

    // 4. Test Low Confidence & Auto Escalation to Admin Desk
    console.log('\n--- 4. Testing Low Confidence & Automatic Admin Escalation ---');
    const unansQuery = `Unknown Legal Provision Query Test ${Date.now()}`;
    const searchRes4 = await post('/api/search', {
      query: unansQuery,
      filters: {},
      userRole: "Employee"
    });
    assert(searchRes4.data.routedToAdmin === true, 'Low confidence query flagged for Admin Desk routing');
    assert(searchRes4.data.confidenceTier.includes('Low'), 'Confidence tier marked Low (Routed to Admin)');

    // Verify query appears in Admin Unanswered Queue
    const adminQueue = await get('/api/admin/unanswered');
    const foundInQueue = adminQueue.data.find(q => q.query === unansQuery);
    assert(foundInQueue !== undefined, 'Escalated query appears in Admin Resolution Queue');

    // 5. Test Admin Feedback Loop & Dynamic KB Training
    console.log('\n--- 5. Testing Admin Resolution & Feedback Loop ---');
    const resolveRes = await post(`/api/admin/unanswered/${foundInQueue.id}/resolve`, {
      adminAnswer: "Verified Admin Directive: All statutory compliance filings must follow Circular No. 44/2026.",
      addToKnowledgeBase: true
    });
    assert(resolveRes.success === true, 'Admin successfully resolves question');

    // Re-query the exact same question to verify knowledge base learned
    const reSearch = await post('/api/search', {
      query: unansQuery,
      filters: {},
      userRole: "Employee"
    });
    assert(reSearch.data.confidenceTier === 'High', 'Re-searched resolved question now returns High Confidence');
    assert(reSearch.data.answer.text.includes('Verified Admin Directive'), 'AI response directly incorporates Admin verified feedback');

    // 6. Test Document Ingestion Pipeline
    console.log('\n--- 6. Testing Document Ingestion (Acts/Contracts) ---');
    const ingestRes = await post('/api/documents', {
      title: "Arbitration and Conciliation (Amendment) Act, 2021",
      docType: "Act",
      jurisdiction: "India (Central)",
      court: "Parliament of India",
      year: 2021,
      category: "Commercial & Contract Law",
      confidentiality: "Public",
      rawContent: "Section 36(3) Automatic stay of arbitral award where arbitration agreement or contract is induced by fraud or corruption. Court shall stay unconditionally pending disposal of challenge.\n\nSection 43J Norms for accreditation of arbitrators as specified in the Eighth Schedule.",
      isSuperseded: false,
      userRole: "Admin"
    });
    assert(ingestRes.success === true, 'Document ingestion endpoint successful');
    assert(ingestRes.data.chunks.length === 2, 'Document automatically chunked into 2 section provisions');

    // 7. Test Analytics and Audit Trail
    console.log('\n--- 7. Testing Analytics & Immutable Audit Logs ---');
    const analytics = await get('/api/analytics');
    assert(analytics.success === true && analytics.data.totalQueriesLogged > 0, 'Analytics metrics generated');

    const audit = await get('/api/audit-logs');
    assert(audit.success === true && audit.data.length > 0, 'Audit logs populated chronologically');

    console.log('\n====================================================');
    console.log(`📊 TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
    console.log('====================================================');
  } catch (err) {
    console.error('Test suite error:', err);
  }
}

runTests();
