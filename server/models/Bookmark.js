// models/Bookmark.js & SavedSearch.js
const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, default: 'emp_current', index: true },
  title: { type: String, required: true },
  docTitle: { type: String, default: '' },
  section: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  bookmarkedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const SavedSearchSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, default: 'emp_current', index: true },
  query: { type: String, required: true },
  tags: [{ type: String }],
  savedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);
const SavedSearch = mongoose.model('SavedSearch', SavedSearchSchema);

module.exports = {
  Bookmark,
  SavedSearch
};
