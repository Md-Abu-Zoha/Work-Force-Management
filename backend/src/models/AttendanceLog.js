const mongoose = require('mongoose');

const AttendanceLogSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    date: { type: Date, required: true },
    hoursWorked: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AttendanceLog', AttendanceLogSchema);


