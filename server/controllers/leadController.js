const Lead = require("../models/Lead");

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    // Add user ID from authenticated request
    const leadData = {
      ...req.body,
      user: req.user.id
    };
    
    const lead = await Lead.create(leadData);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error("CREATE LEAD ERROR:", error);
    // Handle duplicate key error for email + user combination
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have a lead with this email address" 
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get leads (with pagination & filters) - only for current user
exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, source } = req.query;
    const filters = { user: req.user.id }; // Only get leads for current user
    
    if (status) filters.status = status;
    if (source) filters.source = source;

    const leads = await Lead.find(filters)
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(filters);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: leads,
    });
  } catch (error) {
    console.error("GET LEADS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single lead by ID - only if it belongs to current user
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found or access denied" 
      });
    }
    
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update lead - only if it belongs to current user
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Only update if user owns the lead
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found or access denied" 
      });
    }
    
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    // Handle duplicate key error for email + user combination
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have a lead with this email address" 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete lead - only if it belongs to current user
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found or access denied" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Lead deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
