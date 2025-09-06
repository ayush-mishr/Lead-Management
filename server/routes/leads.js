const express = require("express");
const router = express.Router();
const {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead
} = require("../controllers/leadController");
const { auth } = require("../middlewares/auth");

// Test route without auth
router.get("/test", (req, res) => {
    res.json({ message: "Lead routes working!", timestamp: new Date() });
});

// Routes with authentication
router.post("/", auth, createLead);        // Create lead
router.get("/", auth, getLeads);          // Get all leads (with filters & pagination)
router.get("/:id", auth, getLeadById);    // Get single lead by ID
router.put("/:id", auth, updateLead);     // Update lead
router.delete("/:id", auth, deleteLead);  // Delete lead

module.exports = router;
