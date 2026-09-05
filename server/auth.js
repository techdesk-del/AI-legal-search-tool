// server/auth.js - Multi-Role Enterprise Authentication Module
const crypto = require('crypto');

// User Personas Registry
const USERS = [
  {
    id: 'usr-admin-01',
    name: 'Adv. Rajesh Sharma',
    email: 'admin@urbangaon.com',
    password: 'admin123',
    role: 'Admin',
    designation: 'Legal Admin / Lead Counsel',
    avatarInitials: 'RS',
    avatarColor: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    permissions: ['search', 'ingest', 'admin_desk', 'analytics', 'audit_compliance']
  },
  {
    id: 'usr-contrib-02',
    name: 'Vikas Mehra',
    email: 'contributor@urbangaon.com',
    password: 'paralegal123',
    role: 'Contributor',
    designation: 'Contributor / Paralegal',
    avatarInitials: 'VM',
    avatarColor: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    permissions: ['search', 'ingest']
  },
  {
    id: 'usr-emp-03',
    name: 'Aakash Das',
    email: 'employee@urbangaon.com',
    password: 'employee123',
    role: 'Employee',
    designation: 'Employee / Legal Associate',
    avatarInitials: 'AD',
    avatarColor: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    permissions: ['search']
  }
];

// In-memory active tokens store
const activeTokens = new Map();

function generateToken(user) {
  const token = `ubg_tok_${crypto.randomBytes(24).toString('hex')}`;
  activeTokens.set(token, {
    userId: user.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  return token;
}

function authenticateUser(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = USERS.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password.trim()) {
    return { success: false, error: 'Invalid email or password' };
  }

  const token = generateToken(user);
  const { password: _, ...safeProfile } = user;

  return {
    success: true,
    user: safeProfile,
    token
  };
}

function verifyToken(token) {
  if (!token) return null;
  const session = activeTokens.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeTokens.delete(token);
    return null;
  }

  const user = USERS.find(u => u.id === session.userId);
  if (!user) return null;

  const { password: _, ...safeProfile } = user;
  return safeProfile;
}

function invalidateToken(token) {
  if (token && activeTokens.has(token)) {
    activeTokens.delete(token);
    return true;
  }
  return false;
}

function getUserById(id) {
  const user = USERS.find(u => u.id === id);
  if (!user) return null;
  const { password: _, ...safeProfile } = user;
  return safeProfile;
}

function getAllUsers() {
  return USERS.map(({ password: _, ...safeProfile }) => safeProfile);
}

module.exports = {
  authenticateUser,
  verifyToken,
  invalidateToken,
  getUserById,
  getAllUsers,
  USERS
};
