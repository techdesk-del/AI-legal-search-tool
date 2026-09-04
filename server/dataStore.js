// dataStore.js - MongoDB & JSON Storage Manager with Automatic Seeding
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DocumentModel = require('./models/Document');
const UnansweredQuestionModel = require('./models/UnansweredQuestion');
const AuditLogModel = require('./models/AuditLog');
const { Bookmark: BookmarkModel, SavedSearch: SavedSearchModel } = require('./models/Bookmark');

const {
  defaultDocuments,
  defaultUnansweredQuestions,
  defaultAuditLogs,
  defaultSavedSearches,
  defaultBookmarks
} = require('./seedData');

const DB_FILE_PATH = path.join(__dirname, 'database.json');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://techdesk_db_user:aakash2899@ailegalsearchtool.zegxjbz.mongodb.net/urbangaon_legal_db?retryWrites=true&w=majority&appName=AILegalSearchTool';

class DataStore {
  constructor() {
    this.isMongoConnected = false;
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

    // Load initial local state
    this.loadFromDisk();

    // Connect to MongoDB
    this.connectMongoDB();
  }

  async connectMongoDB() {
    try {
      console.log(`🔌 Attempting to connect to MongoDB: ${MONGODB_URI}...`);
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 4000
      });
      this.isMongoConnected = true;
      console.log('✅ Connected to MongoDB successfully!');

      // Sync & Seed MongoDB Collections
      await this.syncAndSeedMongo();
    } catch (err) {
      console.warn(`⚠️ MongoDB connection unavailable (${err.message}). Running with persistent fallback storage.`);
      this.isMongoConnected = false;
    }
  }

  async syncAndSeedMongo() {
    try {
      if (!this.isMongoConnected) return;

      const docCount = await DocumentModel.countDocuments();
      if (docCount === 0) {
        console.log('🌱 Seeding default legal documents into MongoDB...');
        await DocumentModel.insertMany(defaultDocuments);
      } else {
        // Load documents from MongoDB into memory
        const mongoDocs = await DocumentModel.find({}).lean();
        this.data.documents = mongoDocs;
      }

      const unansCount = await UnansweredQuestionModel.countDocuments();
      if (unansCount === 0) {
        await UnansweredQuestionModel.insertMany(defaultUnansweredQuestions);
      } else {
        const mongoUnans = await UnansweredQuestionModel.find({}).lean();
        this.data.unansweredQuestions = mongoUnans;
      }

      const auditCount = await AuditLogModel.countDocuments();
      if (auditCount === 0) {
        await AuditLogModel.insertMany(defaultAuditLogs);
      } else {
        const mongoAudit = await AuditLogModel.find({}).sort({ timestamp: -1 }).limit(100).lean();
        this.data.auditLogs = mongoAudit;
      }

      const bmCount = await BookmarkModel.countDocuments();
      if (bmCount === 0) {
        await BookmarkModel.insertMany(defaultBookmarks);
      } else {
        this.data.bookmarks = await BookmarkModel.find({}).lean();
      }

      const searchCount = await SavedSearchModel.countDocuments();
      if (searchCount === 0) {
        await SavedSearchModel.insertMany(defaultSavedSearches);
      } else {
        this.data.savedSearches = await SavedSearchModel.find({}).lean();
      }

      this.saveToDisk();
      console.log('✨ MongoDB synchronization and memory cache initialized.');
    } catch (err) {
      console.error('Error syncing MongoDB data:', err);
    }
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        try {
          this.data = require('./database.json');
        } catch (e) {
          // Defaults are already set in constructor
        }
      }
      if (!this.data.documents) this.data.documents = defaultDocuments;
      if (!this.data.unansweredQuestions) this.data.unansweredQuestions = defaultUnansweredQuestions;
      if (!this.data.auditLogs) this.data.auditLogs = defaultAuditLogs;
      if (!this.data.savedSearches) this.data.savedSearches = defaultSavedSearches;
      if (!this.data.bookmarks) this.data.bookmarks = defaultBookmarks;
    } catch (err) {
      console.warn('Fallback to memory state:', err.message);
    }
  }

  saveToDisk() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      // In read-only serverless filesystems (Vercel), write is silently ignored while keeping in-memory & Mongo state
    }
  }

  // Documents
  getDocuments(userRole = 'Employee') {
    if (userRole === 'Admin') {
      return this.data.documents;
    }
    return this.data.documents.filter(d => d.confidentiality !== 'Confidential');
  }

  getDocumentById(id) {
    return this.data.documents.find(d => d.id === id);
  }

  async addDocument(doc) {
    this.data.documents.unshift(doc);
    this.saveToDisk();

    if (this.isMongoConnected) {
      try {
        await DocumentModel.create(doc);
      } catch (err) {
        console.error('MongoDB document insert error:', err);
      }
    }
    return doc;
  }

  async updateDocument(id, updates) {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.data.documents[idx] = { ...this.data.documents[idx], ...updates };
      this.saveToDisk();

      if (this.isMongoConnected) {
        try {
          await DocumentModel.findOneAndUpdate({ id }, updates);
        } catch (err) {
          console.error('MongoDB document update error:', err);
        }
      }
      return this.data.documents[idx];
    }
    return null;
  }

  async deleteDocument(id) {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx !== -1) {
      const removed = this.data.documents.splice(idx, 1)[0];
      this.saveToDisk();

      if (this.isMongoConnected) {
        try {
          await DocumentModel.findOneAndDelete({ id });
        } catch (err) {
          console.error('MongoDB document delete error:', err);
        }
      }
      return removed;
    }
    return null;
  }

  // Unanswered Questions
  getUnansweredQuestions() {
    return this.data.unansweredQuestions.sort((a, b) => (b.frequency || 1) - (a.frequency || 1));
  }

  async addUnansweredQuestion(query, askedBy, category = 'General Legal', confidenceScore = 0.2) {
    const existing = this.data.unansweredQuestions.find(q => 
      q.query.trim().toLowerCase() === query.trim().toLowerCase()
    );
    if (existing) {
      existing.frequency = (existing.frequency || 1) + 1;
      existing.lastAskedAt = new Date().toISOString();
      this.saveToDisk();

      if (this.isMongoConnected) {
        try {
          await UnansweredQuestionModel.findOneAndUpdate(
            { id: existing.id },
            { frequency: existing.frequency, lastAskedAt: existing.lastAskedAt }
          );
        } catch (err) {}
      }
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

    if (this.isMongoConnected) {
      try {
        await UnansweredQuestionModel.create(newQuestion);
      } catch (err) {}
    }
    return newQuestion;
  }

  async resolveUnansweredQuestion(id, adminAnswer, resolvedCategory, addToKnowledgeBase = true) {
    const question = this.data.unansweredQuestions.find(q => q.id === id);
    if (!question) return null;

    question.status = 'Resolved';
    question.adminAnswer = adminAnswer;
    question.resolvedAt = new Date().toISOString();

    if (this.isMongoConnected) {
      try {
        await UnansweredQuestionModel.findOneAndUpdate(
          { id },
          { status: 'Resolved', adminAnswer, resolvedAt: question.resolvedAt }
        );
      } catch (err) {}
    }

    if (addToKnowledgeBase) {
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
        if (this.isMongoConnected) {
          try { await DocumentModel.create(adminDoc); } catch (e) {}
        }
      }

      const newChunkId = `chunk-resolved-${Date.now()}`;
      const terms = question.query.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3);
      const chunkData = {
        id: newChunkId,
        section: `Admin Verified Advisory: Q-${question.id.substring(0, 8)}`,
        heading: question.query,
        content: `ADMIN VERIFIED LEGAL RESOLUTION: ${adminAnswer}\n\nOriginal Query: "${question.query}" (Resolved by Legal Admin on ${new Date().toLocaleDateString()})`,
        tags: ["admin-verified", "feedback-loop", ...terms]
      };

      adminDoc.chunks.unshift(chunkData);
      if (this.isMongoConnected) {
        try {
          await DocumentModel.findOneAndUpdate({ id: adminDocId }, { chunks: adminDoc.chunks });
        } catch (e) {}
      }
    }

    this.saveToDisk();
    return question;
  }

  async dismissUnansweredQuestion(id, note = "Out of scope / non-legal query") {
    const question = this.data.unansweredQuestions.find(q => q.id === id);
    if (!question) return null;
    question.status = 'Dismissed';
    question.adminAnswer = `Dismissed: ${note}`;
    question.resolvedAt = new Date().toISOString();
    this.saveToDisk();

    if (this.isMongoConnected) {
      try {
        await UnansweredQuestionModel.findOneAndUpdate({ id }, { status: 'Dismissed', adminAnswer: question.adminAnswer, resolvedAt: question.resolvedAt });
      } catch (e) {}
    }
    return question;
  }

  // Audit Logs
  getAuditLogs() {
    return this.data.auditLogs.slice(0, 100);
  }

  async logAction(logEntry) {
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

    if (this.isMongoConnected) {
      try {
        await AuditLogModel.create(entry);
      } catch (err) {}
    }
    return entry;
  }

  // Bookmarks & Saved Searches
  getBookmarks(userId = 'emp_current') {
    return this.data.bookmarks.filter(b => b.userId === userId || !b.userId);
  }

  async addBookmark(bookmark) {
    const bm = {
      id: `bm-${Date.now()}`,
      bookmarkedAt: new Date().toISOString(),
      ...bookmark
    };
    this.data.bookmarks.unshift(bm);
    this.saveToDisk();

    if (this.isMongoConnected) {
      try { await BookmarkModel.create(bm); } catch (e) {}
    }
    return bm;
  }

  async removeBookmark(id) {
    const idx = this.data.bookmarks.findIndex(b => b.id === id);
    if (idx !== -1) {
      const removed = this.data.bookmarks.splice(idx, 1)[0];
      this.saveToDisk();
      if (this.isMongoConnected) {
        try { await BookmarkModel.findOneAndDelete({ id }); } catch (e) {}
      }
      return removed;
    }
    return null;
  }

  getSavedSearches(userId = 'emp_current') {
    return this.data.savedSearches.filter(s => s.userId === userId || !s.userId);
  }

  async addSavedSearch(search) {
    const s = {
      id: `saved-${Date.now()}`,
      savedAt: new Date().toISOString(),
      ...search
    };
    this.data.savedSearches.unshift(s);
    this.saveToDisk();

    if (this.isMongoConnected) {
      try { await SavedSearchModel.create(s); } catch (e) {}
    }
    return s;
  }

  async removeSavedSearch(id) {
    const idx = this.data.savedSearches.findIndex(s => s.id === id);
    if (idx !== -1) {
      const removed = this.data.savedSearches.splice(idx, 1)[0];
      this.saveToDisk();
      if (this.isMongoConnected) {
        try { await SavedSearchModel.findOneAndDelete({ id }); } catch (e) {}
      }
      return removed;
    }
    return null;
  }
}

module.exports = new DataStore();
