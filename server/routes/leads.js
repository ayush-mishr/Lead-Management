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

// All routes require authentication
router.use(auth);

// Routes
router.post("/", createLead);        // Create lead
router.get("/", getLeads);          // Get all leads (with filters & pagination)
router.get("/:id", getLeadById);    // Get single lead by ID
router.put("/:id", updateLead);     // Update lead
router.delete("/:id", deleteLead);  // Delete lead

module.exports = router;
