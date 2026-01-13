const express = require('express');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const existing = await AdminUser.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = new AdminUser({ email, passwordHash: '' });
    await user.setPassword(password);
    await user.save();
    return res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const user = await AdminUser.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: 'admin' },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' });
  }
});

// POST /api/auth/reset-password
// Secure by requiring ADMIN_RESET_SECRET; use only for local development.
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword, adminSecret } = req.body;
    if (!email || !newPassword || !adminSecret) {
      return res.status(400).json({ message: 'email, newPassword and adminSecret are required' });
    }
    if (adminSecret !== (process.env.ADMIN_RESET_SECRET || '')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await AdminUser.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.setPassword(newPassword);
    await user.save();
    return res.json({ message: 'Password updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Reset failed' });
  }
});

module.exports = router;


