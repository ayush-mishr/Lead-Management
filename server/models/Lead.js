const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    city: { type: String },
    state: { type: String },
    source: { type: String, default: "website" },
    status: { type: String, default: "new" },
    score: { type: Number, default: 0 },
    lead_value: { type: Number, default: 0 },
    is_qualified: { type: String, default:"false" },
    last_activity: { type: Date },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Create compound index for user + email to ensure unique emails per user
LeadSchema.index({ user: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Lead", LeadSchema);
