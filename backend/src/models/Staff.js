const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema(
  {
    staffId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', StaffSchema);


