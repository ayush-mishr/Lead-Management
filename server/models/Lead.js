const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    company: { type: String },
    city: { type: String },
    state: { type: String },
    source: {
        type: String,
        enum: ["website", "facebook_ads", "google_ads", "referral", "events", "other"],
        default: "website"
    },
    status: {
        type: String,
        enum: ["new", "contacted", "qualified", "lost", "won"],
        default: "new"
    },
    score: { type: Number, default: 0 },
    lead_value: { type: Number, default: 0 },
    last_activity_at: { type: Date, default: null },
    is_qualified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);
