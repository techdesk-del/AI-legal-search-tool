// models/AuditLog.js - MongoDB Schema for Compliance & Audit Trail
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now, index: true },
  userId: { type: String, default: 'emp_current' },
  userName: { type: String, default: 'Associate' },
  userRole: { type: String, default: 'Employee', index: true },
  action: { type: String, required: true, index: true },
  query: { type: String, default: '' },
  confidenceScore: { type: Number, default: 0.0 },
  confidenceTier: { type: String, default: 'N/A' },
  citationsCount: { type: Number, default: 0 },
  retrievedDocs: [{ type: String }],
  ipAddress: { type: String, default: '127.0.0.1' }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
