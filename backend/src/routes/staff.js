const express = require('express');
const Staff = require('../models/Staff');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/staff - fetch all staff (public for fetching list)
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find({}).sort({ name: 1 });
    return res.json(staff);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch staff' });
  }
});

// POST /api/staff - add new staff (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { staffId, name } = req.body;
    if (!staffId || !name) {
      return res.status(400).json({ message: 'staffId and name are required' });
    }
    const created = await Staff.create({ staffId, name });
    return res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'staffId must be unique' });
    }
    return res.status(500).json({ message: 'Failed to create staff' });
  }
});

// PUT /api/staff/:id - update staff name (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }
    const updated = await Staff.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Staff not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update staff' });
  }
});

// DELETE /api/staff/:id - delete staff (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Staff not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete staff' });
  }
});

module.exports = router;


