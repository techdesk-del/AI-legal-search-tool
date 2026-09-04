# URBANGAON AI LEGAL SEARCH PLATFORM — COMPLETE USER & TECHNICAL MANUAL

> **Version:** 1.0.0 Enterprise Edition  
> **Prepared For:** AI Tool Development & Corporate Legal Team  
> **Database:** Live MongoDB Atlas Cloud Integration (`ailegalsearchtool.zegxjbz.mongodb.net`)

---

## 1. Overview & Architecture

The **Urbangaon AI Legal Search Platform** is an enterprise-grade AI legal intelligence system designed according to **Module 2 of the Urbangaon AI Requirements Document**. It consolidates Statutory Acts, Supreme Court & High Court Precedents, Corporate Contracts & MSAs, and YouTube Video Lectures into a single natural language search portal with exact traceability, video timestamp seeking, automated admin escalation, and a continuous knowledge improvement feedback loop.

### System Architecture

```mermaid
graph TD
    User([Associate / Legal Researcher]) --> UI[Executive Web Portal UI]
    Contributor([Contributor / Paralegal]) --> UI
    Admin([Lead Counsel / Admin]) --> UI

    UI --> Server[Node.js / Express API Server]
    Server --> SearchEngine[Hybrid Vector & Semantic Legal Engine]
    Server --> IngestionPipeline[Multi-Modal Chunking & Ingestion Pipeline]
    Server --> AdminFeedbackDesk[Unanswered Resolution & Feedback Loop]
    Server --> ComplianceLogger[Immutable Audit & Analytics Engine]

    SearchEngine --> MongoAtlas[(MongoDB Atlas Cloud Database)]
    IngestionPipeline --> MongoAtlas
    AdminFeedbackDesk --> MongoAtlas
    ComplianceLogger --> MongoAtlas
```

---

## 2. Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher)
- NPM (v9 or higher)
- Internet connection for MongoDB Atlas Cloud sync

### Environment Configuration (`.env`)
The application is configured in `.env`:
```env
PORT=4000
MONGODB_URI=mongodb+srv://techdesk_db_user:aakash2899@ailegalsearchtool.zegxjbz.mongodb.net/urbangaon_legal_db?retryWrites=true&w=majority&appName=AILegalSearchTool
```

### Starting the Server
Run the application using:
```bash
npm start
```
Open your browser and navigate to: **`http://localhost:4000`**

---

## 3. Detailed Feature-by-Feature User Guide

### 3.1 Header Controls & Role Switcher
Located at the top of the interface:
- **Brand Logo & Live Indicator**: Displays platform connectivity.
- **Admin Desk Alert Badge**: Displays the real-time count of pending low-confidence questions waiting for Lead Counsel review (e.g. `Admin Desk: 3 Pending`). Clicking it jumps directly to the Admin Desk.
- **Active Role Switcher**:
  - **Employee / Associate**: Read-only research access to Public and Internal documents; automatically routes low-confidence queries to admin.
  - **Contributor / Paralegal**: Can upload new legal documents, videos, and tag metadata.
  - **Legal Admin / Lead Counsel**: Full administrative control — resolves pending questions, feeds verified answers back into the knowledge base, manages documents, and inspects audit logs.

---

### 3.2 Tab 1: AI Legal Search & Research Workspace

This is the primary research workbench for lawyers, HR, and compliance teams.

#### 1. Asking Natural Language Questions
- Type your question in plain English (or Hindi-English legal queries) into the central search bar.
- **Example Queries**:
  - *"What is the notice period required to terminate an employee under the Industrial Disputes Act?"*
  - *"Why was Section 66A IT Act struck down by the Supreme Court?"*
  - *"What is the formula for 15 days severance pay in video lecture?"*
  - *"What is the quorum and composition for Internal Complaints Committee under POSH Act?"*
  - *"Are post-employment non-compete clauses valid under Indian Contract Act?"*
  - *"What is the service credit if uptime falls below 99.5% in Cloud SLA agreement?"*
- Hit **Enter** or click **`Ask AI ➔`**.

#### 2. Quick Sample Query Pills
Click any sample pill below the search bar to run instant demonstration queries.

#### 3. Faceted Filter Bar
Refine your search with dropdown filters:
- **Document Type**: All Types, Statutory Acts, Judgements, Contracts, YouTube Videos, or Admin Verified FAQs.
- **Jurisdiction / Forum**: All, India (Central), Supreme Court of India, Corporate Legal.
- **Action Buttons**:
  - **`⭐ Save Query`**: Saves the query to your personal Research Vault (persisted in MongoDB Atlas).
  - **`📄 Export Legal Brief`**: Generates a formatted, printable legal research brief.

#### 4. AI Legal Research Synthesis Card
The top answer card delivers:
- **Synthesized Direct Legal Opinion**: Synthesizes statutory sections, case precedents, or video transcripts into an executive summary.
- **Confidence Indicator Badge**:
  - 🟢 **High Confidence (>= 70%)**: Verified authority match.
  - 🟡 **Medium Confidence (45% - 69%)**: Cautionary preliminary response.
  - 🔴 **Low Confidence (< 45%) / Gaps**: Transparent notice *"No confident match found"* + automatically escalates query to the Admin Desk.
- **Statutory Legal Disclaimer**: Mandatory legal research aid disclaimer.
- **Toolbar Actions**:
  - **`📋 Copy Synthesis`**: Copies the answer text to clipboard.
  - **`⭐ Bookmark Clause`**: Saves the top statutory clause to your vault.

#### 5. Exact Source Citations & Authorities List
Each retrieved source is presented as a card with:
- Document Type tag (📜 Act, ⚖️ Judgement, 📑 Contract, 🎥 YouTube Video).
- Court / Forum and Year.
- Section / Paragraph badge (e.g. `Section 25F - Conditions precedent to retrenchment`).
- **Supersession Warning Banner**: Displays red alert if the law was amended or struck down (e.g. *Section 66A IT Act in Shreya Singhal v. UOI*).
- Exact quoted statutory excerpt.
- **Action Buttons**:
  - **`🔍 Inspect Full Text`**: Opens the Full Document Inspector Modal with highlighted chunks.
  - **`▶️ Play at Timestamp [MM:SS]`** *(For YouTube Videos)*: Opens the video player and seeks directly to the exact second of that legal point.

#### 6. Right Sidebar: Related Queries & Personal Vault
- **💡 Related Legal Queries**: Contextual suggestions based on legal doctrine (*"Users who searched this also viewed..."*). Click any suggestion to search instantly.
- **⭐ Saved Clauses & Queries**: Displays all your bookmarked clauses and saved queries. Click any saved item to re-execute.

---

### 3.3 Tab 2: Knowledge Base & Ingestion Repository

Central library of all indexed legal authorities.

#### 1. Browsing & Category Filtering
Filter documents using category pills:
- `All Categories`, `Labour & Employment`, `Cyber & Tech Law`, `Constitutional & Privacy Law`, `Corporate Law`, `Commercial & Contract Law`, `Video Webinars`.

#### 2. Inspecting Indexed Chunks
Click **`View Chunks`** on any document card to open a modal listing all section chunks, paragraph breakdowns, and tags.

#### 3. Ingesting New Legal Material (`➕ Ingest New Content / Video`)
Click the gold button to open the Ingestion Modal:
1. **Drag & Drop / File Browser**:
   - Click the blue dashed box or drop `.pdf`, `.docx`, `.txt`, `.md`, `.json`, `.csv`, or scanned files.
   - The system extracts text, auto-populates the Title, and prepares it for chunking.
2. **Metadata Fields**:
   - **Document Title**: e.g., *Digital Personal Data Protection Act, 2023*.
   - **Document Type**: Act, Judgement, Contract, YouTube Video, or Internal Advisory.
   - **Jurisdiction & Court**: e.g., *India (Central)*, *Supreme Court of India*.
   - **Category**: Dropdown category.
   - **Confidentiality Tier**:
     - **Public**: Searchable by all employees.
     - **Internal**: Company employees only.
     - **Confidential**: Restricted to Lead Counsel & Admin.
   - **Year**: e.g., *2024*.
3. **YouTube Video Ingestion Fields**:
   - Set Document Type to `"YouTube Video"`.
   - Enter YouTube Video URL (e.g. `https://www.youtube.com/watch?v=dQw4w9WgXcQ`).
   - Enter Duration (e.g. `18:45`).
   - In the text box, paste the transcript with `[MM:SS]` timestamps:
     ```text
     [02:10] Code for Independent Directors (Schedule IV): Explaining mandatory meetings...
     [07:45] Board Committee Requirements: Audit committee composition...
     [12:30] Liability & Safe Harbour Protections: Section 149(12) rules...
     ```
4. **Superseded Law Toggle**:
   - Check **"Mark as Superseded / Struck Down Law"** if the document has been repealed, amended, or overturned by a higher court.
5. Click **`Chunk & Ingest Document ➔`**:
   - The system automatically parses sections and timestamps into distinct chunks, saves them to MongoDB Atlas, and makes them searchable instantly!

---

### 3.4 Tab 3: Admin Resolution Desk & Dynamic Feedback Loop

Solves the cold-start and legal knowledge gap problem.

#### 1. Unanswered & Low-Confidence Queue
- When any user asks a question that receives low confidence (< 45%), the engine logs the question and displays it here.
- Sorted by frequency (e.g. `🔥 7x Asked`, `🔥 4x Asked`), prioritizing the most urgent organizational legal questions.

#### 2. Resolving a Question & Retraining the Knowledge Base
1. Click **`🛡️ Resolve & Feed KB`** on any pending question.
2. Enter the official verified legal guidance or statutory interpretation.
3. Keep **"Feed directly into AI Knowledge Base"** checked.
4. Click **`Publish Resolution & Update KB ➔`**.
5. **Immediate Result**:
   - The question status changes to `Resolved`.
   - A new verified chunk is created in MongoDB Atlas.
   - When any user searches that query again, the engine instantly returns the verified answer with **High Confidence**!

---

### 3.5 Tab 4: Executive Analytics & Gap Insights

Provides real-time visibility into organization-wide legal research activities:
- **KPI Metrics**:
  - Total Legal Searches Logged
  - Average Confidence Score (%)
  - Pending Legal Gap Questions
  - Verified Admin Feedback Loops Integrated
- **Knowledge Base Category Distribution Chart**: Visual breakdown of document coverage.
- **Search Confidence & Escalation Distribution**: Breakdown of High, Medium, and Escalated queries.

---

### 3.6 Tab 5: Compliance & Immutable Audit Trail

Regulatory compliance log tracking every search and action:
- **Timestamp**: Exact UTC and local execution time.
- **User & Role**: Employee name and active access tier.
- **Action Type**: `SEARCH_QUERY`, `UNANSWERED_ESCALATION`, `DOCUMENT_INGESTION`, `ADMIN_FEEDBACK_RESOLVED`.
- **Query / Activity**: Full text of the query.
- **Confidence Tier**: High, Medium, Low (Routed to Admin).
- **Retrieved Documents**: List of all cited authorities.
- **IP Address**: Client network address.

---

## 4. REST API Reference

| Endpoint | Method | Description | Sample Request / Parameters |
| :--- | :---: | :--- | :--- |
| `/api/search` | `POST` | Execute natural language legal search | `{ "query": "Notice period under IDA?", "filters": {}, "userRole": "Employee" }` |
| `/api/documents` | `GET` | Retrieve accessible documents | Query params: `userRole=Employee`, `category=Corporate` |
| `/api/documents/:id` | `GET` | Get full document details and chunks | Param: `id` |
| `/api/documents` | `POST` | Ingest new document / video | Multipart or JSON payload with `title`, `docType`, `rawContent` |
| `/api/documents/:id` | `PUT` | Update document metadata | Param: `id`, body: `{ "isSuperseded": true }` |
| `/api/documents/:id` | `DELETE` | Delete document (Admin only) | Param: `id` |
| `/api/admin/unanswered` | `GET` | List unanswered questions queue | None |
| `/api/admin/unanswered/:id/resolve` | `POST` | Resolve question and feed KB | `{ "adminAnswer": "Verified text...", "addToKnowledgeBase": true }` |
| `/api/admin/unanswered/:id/dismiss` | `POST` | Dismiss question | `{ "note": "Out of scope" }` |
| `/api/analytics` | `GET` | Get executive analytics & charts | None |
| `/api/audit-logs` | `GET` | Get compliance audit logs | None |
| `/api/bookmarks` | `GET` / `POST` | Manage user bookmarks vault | `{ "title": "Sec 25F", "docTitle": "IDA 1947", "excerpt": "..." }` |
| `/api/saved-searches` | `GET` / `POST` | Manage saved search queries | `{ "query": "POSH ICC committee rules" }` |

---

## 5. MongoDB Atlas Database Schema Reference

The platform connects to MongoDB Atlas under database `urbangaon_legal_db`:

### 1. `legaldocuments` Collection
```json
{
  "_id": "ObjectId(...)",
  "id": "doc-act-001",
  "title": "Industrial Disputes Act, 1947",
  "docType": "Act",
  "jurisdiction": "India (Central)",
  "court": "Parliament of India",
  "year": 1947,
  "status": "Active",
  "confidentiality": "Public",
  "category": "Labour & Employment Law",
  "isSuperseded": false,
  "chunks": [
    {
      "id": "chunk-act-001-1",
      "section": "Section 25F",
      "heading": "Conditions precedent to retrenchment of workmen",
      "content": "No workman employed in any industry...",
      "timestampSeconds": null,
      "tags": ["retrenchment", "notice period", "workman"]
    }
  ]
}
```

### 2. `unansweredquestions` Collection
```json
{
  "_id": "ObjectId(...)",
  "id": "unans-001",
  "query": "What is the penalty for non-compliance with DPDP Act 2023?",
  "askedBy": "Rohan Verma (Employee)",
  "frequency": 7,
  "status": "Pending Review",
  "category": "Data Privacy",
  "confidenceScore": 0.18
}
```

### 3. `auditlogs` Collection
```json
{
  "_id": "ObjectId(...)",
  "id": "audit-1772600000",
  "timestamp": "2026-09-02T10:00:00.000Z",
  "userName": "Adv. Rajesh Sharma (Lead Counsel)",
  "userRole": "Admin",
  "action": "SEARCH_QUERY",
  "query": "What is the notice period for workman retrenchment?",
  "confidenceScore": 0.94,
  "confidenceTier": "High",
  "retrievedDocs": ["Industrial Disputes Act, 1947"],
  "ipAddress": "127.0.0.1"
}
```

---

## 6. Verification & Automated Test Suites

The repository contains two automated test suites:

### 1. Comprehensive System Test Suite
Runs 19 end-to-end test cases covering statutory search, video timestamps, supersession alerts, admin escalation, resolution feedback loop, document ingestion, and audit logging:
```bash
node tests/testSuite.js
```

### 2. Live Ingestion & Multi-Modal Search Test
Performs real-time ingestion of Acts, Judgements, Contracts, and YouTube Videos with timestamp seeking directly into MongoDB Atlas:
```bash
node tests/liveIngestionTest.js
```

---
*Urbangaon AI Legal Search Platform — Empowering Corporate Legal & Compliance with Precision Intelligence.*
