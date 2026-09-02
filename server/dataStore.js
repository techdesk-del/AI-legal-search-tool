// dataStore.js - Persistent JSON Storage Manager for AI Legal Search Tool
const fs = require('fs');
const path = require('path');
const {
  defaultDocuments,
  defaultUnansweredQuestions,
  defaultAuditLogs,
  defaultSavedSearches,
  defaultBookmarks
} = require('./seedData');

const DB_FILE_PATH = path.join(__dirname, 'database.json');

class DataStore {
  constructor() {
    this.data = {
      documents: defaultDocuments,
      unansweredQuestions: defaultUnansweredQuestions,
      auditLogs: defaultAuditLogs,
      savedSearches: defaultSavedSearches,
      bookmarks: defaultBookmarks,
      analyticsSummary: {
        totalQueries: 142,
        successfulQueries: 129,
        unansweredEscalations: 13,
        avgConfidence: 0.88,
        activeDocumentsCount: defaultDocuments.length,
        resolvedFeedbackCount: 9
      }
    };
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
        this.data = JSON.parse(raw);
        // Ensure all arrays exist
        if (!this.data.documents) this.data.documents = defaultDocuments;
        if (!this.data.unansweredQuestions) this.data.unansweredQuestions = defaultUnansweredQuestions;
        if (!this.data.auditLogs) this.data.auditLogs = defaultAuditLogs;
        if (!this.data.savedSearches) this.data.savedSearches = defaultSavedSearches;
        if (!this.data.bookmarks) this.data.bookmarks = defaultBookmarks;
      } else {
        this.saveToDisk();
      }
    } catch (err) {
      console.error('Error loading DB from disk, resetting to seed defaults:', err);
      this.saveToDisk();
    }
  }

  saveToDisk() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving DB to disk:', err);
    }
  }

  // Documents
  getDocuments(userRole = 'Employee') {
    if (userRole === 'Admin') {
      return this.data.documents;
    }
    if (userRole === 'Contributor') {
      return this.data.documents.filter(d => d.confidentiality !== 'Confidential');
    }
    // Employee: Public & Internal
    return this.data.documents.filter(d => d.confidentiality !== 'Confidential');
  }

  getDocumentById(id) {
    return this.data.documents.find(d => d.id === id);
  }

  addDocument(doc) {
    this.data.documents.unshift(doc);
    this.saveToDisk();
    return doc;
  }

  updateDocument(id, updates) {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.data.documents[idx] = { ...this.data.documents[idx], ...updates };
      this.saveToDisk();
      return this.data.documents[idx];
    }
    return null;
  }

  deleteDocument(id) {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx !== -1) {
      const removed = this.data.documents.splice(idx, 1);
      this.saveToDisk();
      return removed[0];
    }
    return null;
  }

  // Unanswered / Low Confidence Questions
  getUnansweredQuestions() {
    return this.data.unansweredQuestions.sort((a, b) => (b.frequency || 1) - (a.frequency || 1));
  }

  addUnansweredQuestion(query, askedBy, category = 'General Legal', confidenceScore = 0.2) {
    // Check if duplicate query exists
    const existing = this.data.unansweredQuestions.find(q => 
      q.query.trim().toLowerCase() === query.trim().toLowerCase()
    );
    if (existing) {
      existing.frequency = (existing.frequency || 1) + 1;
      existing.lastAskedAt = new Date().toISOString();
      this.saveToDisk();
      return existing;
    }

    const newQuestion = {
      id: `unans-${Date.now()}`,
      query,
      askedBy,
      frequency: 1,
      firstAskedAt: new Date().toISOString(),
      lastAskedAt: new Date().toISOString(),
      status: 'Pending Review',
      reason: 'Low semantic match or missing legal document authority',
      category,
      adminAnswer: null,
      resolvedAt: null,
      confidenceScore
    };
    this.data.unansweredQuestions.unshift(newQuestion);
    this.saveToDisk();
    return newQuestion;
  }

  resolveUnansweredQuestion(id, adminAnswer, resolvedCategory, addToKnowledgeBase = true) {
    const question = this.data.unansweredQuestions.find(q => q.id === id);
    if (!question) return null;

    question.status = 'Resolved';
    question.adminAnswer = adminAnswer;
    question.resolvedAt = new Date().toISOString();

    if (addToKnowledgeBase) {
      // Create or append to a Knowledge Base document
      const adminDocId = 'doc-admin-kb-001';
      let adminDoc = this.data.documents.find(d => d.id === adminDocId);
      if (!adminDoc) {
        adminDoc = {
          id: adminDocId,
          title: "Legal Team Admin Verified Knowledge Base & FAQ Resolutions",
          docType: "Administrative Clarification",
          jurisdiction: "Corporate Legal Advisory",
          court: "In-House Counsel Advisory",
          year: new Date().getFullYear(),
          status: "Verified Legal Advisory",
          confidentiality: "Public",
          category: resolvedCategory || question.category || "General Legal",
          summary: "Verified answers and official guidance resolved by the legal admin team for previously unanswered questions.",
          isSuperseded: false,
          supersededBy: null,
          chunks: []
        };
        this.data.documents.unshift(adminDoc);
      }

      // Add verified chunk
      const newChunkId = `chunk-resolved-${Date.now()}`;
      const terms = question.query.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3);
      adminDoc.chunks.unshift({
        id: newChunkId,
        section: `Admin Verified Advisory: Q-${question.id.substring(0, 8)}`,
        heading: question.query,
        content: `ADMIN VERIFIED LEGAL RESOLUTION: ${adminAnswer}\n\nOriginal Query: "${question.query}" (Resolved by Legal Admin on ${new Date().toLocaleDateString()})`,
        tags: ["admin-verified", "feedback-loop", ...terms]
      });
    }

    this.saveToDisk();
    return question;
  }

  dismissUnansweredQuestion(id, note = "Out of scope / non-legal query") {
    const question = this.data.unansweredQuestions.find(q => q.id === id);
    if (!question) return null;
    question.status = 'Dismissed';
    question.adminAnswer = `Dismissed: ${note}`;
    question.resolvedAt = new Date().toISOString();
    this.saveToDisk();
    return question;
  }

  // Audit Logs
  getAuditLogs() {
    return this.data.auditLogs.slice(0, 100);
  }

  logAction(logEntry) {
    const entry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      timestamp: new Date().toISOString(),
      ...logEntry
    };
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.saveToDisk();
    return entry;
  }

  // Bookmarks & Saved Searches
  getBookmarks(userId = 'emp_current') {
    return this.data.bookmarks.filter(b => b.userId === userId || !b.userId);
  }

  addBookmark(bookmark) {
    const bm = {
      id: `bm-${Date.now()}`,
      bookmarkedAt: new Date().toISOString(),
      ...bookmark
    };
    this.data.bookmarks.unshift(bm);
    this.saveToDisk();
    return bm;
  }

  removeBookmark(id) {
    const idx = this.data.bookmarks.findIndex(b => b.id === id);
    if (idx !== -1) {
      const removed = this.data.bookmarks.splice(idx, 1);
      this.saveToDisk();
      return removed[0];
    }
    return null;
  }

  getSavedSearches(userId = 'emp_current') {
    return this.data.savedSearches.filter(s => s.userId === userId || !s.userId);
  }

  addSavedSearch(search) {
    const s = {
      id: `saved-${Date.now()}`,
      savedAt: new Date().toISOString(),
      ...search
    };
    this.data.savedSearches.unshift(s);
    this.saveToDisk();
    return s;
  }

  removeSavedSearch(id) {
    const idx = this.data.savedSearches.findIndex(s => s.id === id);
    if (idx !== -1) {
      const removed = this.data.savedSearches.splice(idx, 1);
      this.saveToDisk();
      return removed[0];
    }
    return null;
  }
}

module.exports = new DataStore();
