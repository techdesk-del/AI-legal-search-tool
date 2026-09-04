// models/UnansweredQuestion.js - MongoDB Schema for Unanswered / Low Confidence Questions
const mongoose = require('mongoose');

const UnansweredQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  query: { type: String, required: true, index: true },
  askedBy: { type: String, default: 'Associate' },
  frequency: { type: Number, default: 1, index: true },
  firstAskedAt: { type: Date, default: Date.now },
  lastAskedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending Review', 'Resolved', 'Dismissed'], 
    default: 'Pending Review',
    index: true 
  },
  reason: { type: String, default: 'Low semantic match or missing legal document authority' },
  category: { type: String, default: 'General Legal' },
  adminAnswer: { type: String, default: null },
  resolvedAt: { type: Date, default: null },
  confidenceScore: { type: Number, default: 0.2 }
}, {
  timestamps: true
});

module.exports = mongoose.model('UnansweredQuestion', UnansweredQuestionSchema);
