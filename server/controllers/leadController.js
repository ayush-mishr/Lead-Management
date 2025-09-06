const Lead = require("../models/Lead");
const mongoose = require("mongoose");

// Create a new lead (user-specific)
exports.createLead = async (req, res) => {
  try {
    // Add the authenticated user's ID to the lead data
    const leadData = {
      ...req.body,
      user: req.user.id, // From auth middleware
    };
    
    const lead = await Lead.create(leadData);
    res.status(201).json({ 
      success: true, 
      message: "Lead created successfully",
      data: lead 
    });
  } catch (error) {
    // Handle duplicate email error for the same user
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "A lead with this email already exists in your account" 
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get leads for the authenticated user (with pagination & filters)
exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 1000, status, source } = req.query;
    
    // Base filter - only leads belonging to the authenticated user
    const filters = { user: req.user.id };
    
    // Additional filters
    if (status) filters.status = status;
    if (source) filters.source = source;

    const leads = await Lead.find(filters)
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email'); // Optional: include user info

    const total = await Lead.countDocuments(filters);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      userLeads: true,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single lead by ID (user-specific)
exports.getLeadById = async (req, res) => {
  try {
    // Only find leads that belong to the authenticated user
    const lead = await Lead.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('user', 'firstName lastName email');
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found or you don't have permission to access it" 
      });
    }
    
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update lead (user-specific)
exports.updateLead = async (req, res) => {
  try {
    // Only update leads that belong to the authenticated user
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found or you don't have permission to update it" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Lead updated successfully",
      data: lead 
    });
  } catch (error) {
    // Handle duplicate email error for the same user
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "A lead with this email already exists in your account" 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete lead (user-specific)
exports.deleteLead = async (req, res) => {
  try {
    // Only delete leads that belong to the authenticated user
    const lead = await Lead.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found or you don't have permission to delete it" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Lead deleted successfully",
      data: lead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's lead statistics
exports.getUserLeadStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total leads for user
    const totalLeads = await Lead.countDocuments({ user: userId });
    
    // Get leads by status
    const statusStats = await Lead.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Get leads by source
    const sourceStats = await Lead.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$source", count: { $sum: 1 } } }
    ]);
    
    // Get qualified vs unqualified
    const qualificationStats = await Lead.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$is_qualified", count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        statusBreakdown: statusStats,
        sourceBreakdown: sourceStats,
        qualificationBreakdown: qualificationStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
