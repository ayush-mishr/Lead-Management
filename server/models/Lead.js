const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    company: { type: String },
    city: { type: String },
    state: { type: String },
    source: { type: String, default: "website" },
    status: { type: String, default: "new" },
    score: { type: Number, default: 0 },
    lead_value: { type: Number, default: 0 },
    is_qualified: { type: Boolean, default: false },
    last_activity: { type: Date },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Lead", LeadSchema);
