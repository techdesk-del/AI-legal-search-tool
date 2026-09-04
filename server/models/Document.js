// models/Document.js - MongoDB Mongoose Schema for Legal Documents & Chunks
const mongoose = require('mongoose');

const ChunkSchema = new mongoose.Schema({
  id: { type: String, required: true },
  section: { type: String, default: 'General Provision' },
  heading: { type: String, default: '' },
  content: { type: String, required: true },
  timestampSeconds: { type: Number, default: null },
  timestampDisplay: { type: String, default: null },
  tags: [{ type: String }]
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true, index: true },
  docType: { 
    type: String, 
    required: true, 
    enum: ['Act', 'Judgement', 'Contract', 'YouTube Video', 'Administrative Clarification'],
    index: true 
  },
  jurisdiction: { type: String, default: 'India (Central)' },
  court: { type: String, default: 'General' },
  year: { type: Number, default: new Date().getFullYear(), index: true },
  status: { type: String, default: 'Active' },
  confidentiality: { 
    type: String, 
    enum: ['Public', 'Internal', 'Confidential'], 
    default: 'Public',
    index: true 
  },
  category: { type: String, default: 'General Legal', index: true },
  sourceUrl: { type: String, default: '' },
  videoDuration: { type: String, default: null },
  summary: { type: String, default: '' },
  citationRef: { type: String, default: null },
  isSuperseded: { type: Boolean, default: false },
  supersededBy: { type: String, default: null },
  chunks: [ChunkSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('LegalDocument', DocumentSchema);
