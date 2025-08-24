const Lead = require("../models/Lead");
//  Create a new lead
exports.createLead = async (req, res) => {
    try {
        const lead = await Lead.create(req.body);
        res.status(201).json({ success: true, data: lead });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

//  Get leads (with pagination & filters)
exports.getLeads = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, source } = req.query;

        let filters = {};
        if (status) filters.status = status;
        if (source) filters.source = source;

        const leads = await Lead.find(filters)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Lead.countDocuments(filters);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            limit: Number(limit),
            data: leads
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Get single lead by ID
exports.getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

        res.status(200).json({ success: true, data: lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Update lead
exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

        res.status(200).json({ success: true, data: lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Delete lead
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

        res.status(200).json({ success: true, message: "Lead deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
