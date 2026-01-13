const express = require('express');
const AttendanceLog = require('../models/AttendanceLog');
const Staff = require('../models/Staff');

const router = express.Router();

// POST /api/attendance/log - bulk log attendance array
router.post('/log', async (req, res) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: 'entries array is required' });
    }

    // Normalize entries; if name not provided, look it up from Staff
    const staffIds = Array.from(
      new Set(entries.map((e) => String(e.staff)).filter(Boolean))
    );
    const staffDocs = await Staff.find({ _id: { $in: staffIds } }).lean();
    const idToStaff = new Map(staffDocs.map((s) => [String(s._id), s]));

    const docs = entries.map((e) => {
      const s = idToStaff.get(String(e.staff));
      return {
        staff: e.staff,
        name: e.staffName || e.name || (s ? s.name : undefined),
        date: e.date ? new Date(e.date) : new Date(),
        hoursWorked: e.hoursWorked,
      };
    });

    const created = await AttendanceLog.insertMany(docs);
    return res.status(201).json({ inserted: created.length });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to log attendance' });
  }
});

// POST /api/attendance/backfill-names - one-time utility to fill missing names
router.post('/backfill-names', async (_req, res) => {
  try {
    const missing = await AttendanceLog.find({ $or: [{ name: { $exists: false } }, { name: null }] })
      .select({ _id: 1, staff: 1 })
      .lean();
    if (missing.length === 0) {
      return res.json({ updated: 0 });
    }
    const ids = Array.from(new Set(missing.map((m) => String(m.staff))));
    const staffDocs = await Staff.find({ _id: { $in: ids } }).lean();
    const idToStaff = new Map(staffDocs.map((s) => [String(s._id), s]));
    const ops = missing
      .map((m) => {
        const s = idToStaff.get(String(m.staff));
        if (!s) return null;
        return {
          updateOne: {
            filter: { _id: m._id },
            update: { $set: { name: s.name } },
          },
        };
      })
      .filter(Boolean);
    if (ops.length === 0) return res.json({ updated: 0 });
    const result = await AttendanceLog.bulkWrite(ops, { ordered: false });
    return res.json({ updated: result.modifiedCount || 0 });
  } catch (err) {
    return res.status(500).json({ message: 'Backfill failed' });
  }
});

module.exports = router;


