const mongoose = require('mongoose');
const Lead = require('./models/Lead');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    checkLeads();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

async function checkLeads() {
  try {
    // Get all leads
    const allLeads = await Lead.find({});
    console.log(`\n📊 Total leads in database: ${allLeads.length}`);
    
    // Check for leads without user field
    const leadsWithoutUser = await Lead.find({ user: { $exists: false } });
    console.log(`❌ Leads without user field: ${leadsWithoutUser.length}`);
    
    // Check for leads with null user
    const leadsWithNullUser = await Lead.find({ user: null });
    console.log(`❌ Leads with null user: ${leadsWithNullUser.length}`);
    
    // Group leads by user
    const leadsByUser = await Lead.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
          leads: { $push: { name: "$name", email: "$email" } }
        }
      }
    ]);
    
    console.log('\n👥 Leads grouped by user:');
    leadsByUser.forEach(group => {
      console.log(`  User ID: ${group._id || 'No User'} - ${group.count} leads`);
      group.leads.forEach(lead => {
        console.log(`    - ${lead.name} (${lead.email})`);
      });
    });
    
    // If there are orphaned leads, let's see their details
    if (leadsWithoutUser.length > 0 || leadsWithNullUser.length > 0) {
      console.log('\n🔍 Orphaned leads details:');
      const orphanedLeads = [...leadsWithoutUser, ...leadsWithNullUser];
      orphanedLeads.forEach(lead => {
        console.log(`  - ${lead.name} (${lead.email}) - Created: ${lead.createdAt}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking leads:', error);
  } finally {
    mongoose.disconnect();
  }
}
