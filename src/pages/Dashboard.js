import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { Table } from '../components/Table';
import FirstLeadForm from '../components/FirstLeadForm';
import { apiConnector } from '../operations/ApiConnector';
import useAutoLogout from '../hooks/useAutoLogout';

const Dashboard = () => {
  const { user } = useSelector((state) => state.profile);
  const { signupData, token } = useSelector((state) => state.auth);
  const [dashboardStats, setDashboardStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    totalValue: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [showFirstLeadForm, setShowFirstLeadForm] = useState(false);

  // Get user info for dashboard personalization - Memoized to prevent re-computation
  const userInfo = useMemo(() => {
    // Priority 1: Use authenticated user data from login
    if (user && user.firstName) {
      return {
        firstName: user.firstName,
        lastName: user.lastName || '',
        email: user.email || '',
        userId: user._id || user.id,
        isAuthenticated: true
      };
    } 
    // Priority 2: Use signup data for newly registered users
    else if (signupData && signupData.firstName) {
      return {
        firstName: signupData.firstName,
        lastName: signupData.lastName || '',
        email: signupData.email || '',
        userId: null, // New signup user will get ID after first API call
        isAuthenticated: true
      };
    }
    // Priority 3: Default for unauthenticated users
    return {
      firstName: 'Guest',
      lastName: '',
      email: '',
      userId: null,
      isAuthenticated: false
    };
  }, [user, signupData]);

  // Fetch leads and calculate statistics - Only for authenticated users
  const fetchDashboardData = useCallback(async () => {
    // Check if user is authenticated
    if (!token || !userInfo.isAuthenticated) {
      console.log('[DASHBOARD] User not authenticated - redirecting to login');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      console.log(`[USER ISOLATION] 🔐 Fetching leads for user: ${userInfo.firstName} ${userInfo.lastName} (${userInfo.email})`);
      console.log(`[USER ISOLATION] 🆔 User ID: ${userInfo.userId || 'New User'}`);
      
      const response = await apiConnector(
        "GET", 
        "https://lead-management-2-wnen.onrender.com/api/v1/leads",
        null,
        {
          Authorization: `Bearer ${token}`
        }
      );
      
      if (response && response.data && response.data.success) {
        // Backend ensures user-specific data through JWT token and user ID filtering
        const leads = response.data.data || [];
        
        console.log(`[USER ISOLATION] ✅ User ${userInfo.firstName} has ${leads.length} personal leads`);
        console.log(`[SECURITY] 🔒 All leads filtered by user ID on server - no cross-user access`);
        
        // For NEW USERS: If no leads exist, they start with empty dashboard
        if (leads.length === 0) {
          console.log(`[NEW USER] 🆕 User ${userInfo.firstName} is starting with empty dashboard (0 leads)`);
          setDashboardStats({
            totalLeads: 0,
            qualifiedLeads: 0,
            totalValue: 0,
            conversionRate: 0
          });
          setShowFirstLeadForm(true); // Show form to create first lead
        } else {
          // EXISTING USERS: Calculate stats from their personal leads
          console.log(`[EXISTING USER] 📊 Calculating stats for ${userInfo.firstName}'s ${leads.length} leads`);
          
          const totalLeads = leads.length;
          const qualifiedLeads = leads.filter(lead => 
            lead.is_qualified === true || lead.is_qualified === 'true'
          ).length;
          const totalValue = leads.reduce((sum, lead) => sum + (parseFloat(lead.lead_value) || 0), 0);
          const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
          
          setDashboardStats({
            totalLeads,
            qualifiedLeads,
            totalValue,
            conversionRate
          });
          
          setShowFirstLeadForm(false); // Hide first lead form since user has leads
          
          console.log(`[USER STATS] 📈 ${userInfo.firstName}'s Dashboard Stats:`, {
            totalLeads,
            qualifiedLeads,
            totalValue,
            conversionRate
          });
        }
        
        // Use dashboardStats for consistency instead of the scoped variable
        if (leads.length === 0) {
          console.log(`[NEW USER] ${userInfo.firstName} has not created any leads yet - showing welcome form`);
        } else {
          console.log(`[RETURNING USER] ${userInfo.firstName} has ${leads.length} personally created leads`);
        }
      } else {
        // New user or error - show empty dashboard
        console.log(`[NEW USER] ${userInfo.firstName} - initializing empty personal dashboard`);
        setDashboardStats({
          totalLeads: 0,
          qualifiedLeads: 0,
          totalValue: 0,
          conversionRate: 0
        });
        setShowFirstLeadForm(true);
      }
    } catch (error) {
      console.error(`[ERROR] Failed to fetch leads for user ${userInfo.firstName}:`, error);
      // For new users or errors, set empty stats and show form
      setDashboardStats({
        totalLeads: 0,
        qualifiedLeads: 0,
        totalValue: 0,
        conversionRate: 0
      });
      setShowFirstLeadForm(true);
    } finally {
      setLoading(false);
    }
  }, [token, userInfo]);

  const handleFirstLeadAdded = useCallback(() => {
    setShowFirstLeadForm(false);
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto logout hook
  useAutoLogout();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Don't render if no user info available
  if (!userInfo || userInfo.firstName === 'User') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Setting up your personal dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Dashboard Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Welcome back, {userInfo.firstName}!
                </h1>
                <p className="text-sm text-slate-600 mt-2">
                  {dashboardStats.totalLeads === 0 
                    ? `Start building your personal lead portfolio - create your first lead below` 
                    : `You have ${dashboardStats.totalLeads} leads in your personal workspace`
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">{userInfo.firstName} {userInfo.lastName}</p>
                  <p className="text-xs text-slate-500">{userInfo.email}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {userInfo.firstName.charAt(0).toUpperCase()}{userInfo.lastName ? userInfo.lastName.charAt(0).toUpperCase() : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats at Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-600 truncate">Total Leads</dt>
                    <dd className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      {loading ? (
                        <div className="animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 h-8 w-12 rounded"></div>
                      ) : (
                        dashboardStats.totalLeads
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-600 truncate">Qualified Leads</dt>
                    <dd className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-800 bg-clip-text text-transparent">
                      {loading ? (
                        <div className="animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 h-8 w-12 rounded"></div>
                      ) : (
                        dashboardStats.qualifiedLeads
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* First Lead Form or Lead Management Table - Full Width */}
        {showFirstLeadForm ? (
          <div className="w-full">
            <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/40 overflow-hidden">
              <div className="p-8">
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
                    {userInfo.firstName.charAt(0).toUpperCase()}{userInfo.lastName ? userInfo.lastName.charAt(0).toUpperCase() : ''}
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
                    Welcome to Your Personal Dashboard, {userInfo.firstName}!
                  </h2>
                  <p className="text-slate-600 text-lg mb-4">
                    This is your private workspace where you can manage your leads
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <strong>Your Personal Lead Space:</strong> You will only see leads that YOU create. 
                          No other user can see your leads, and you cannot see theirs. Each account has completely separate data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <FirstLeadForm onLeadAdded={handleFirstLeadAdded} />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/40 overflow-hidden">
            <div className="p-8">
              <div className="mb-6 border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                      {userInfo.firstName}'s Personal Leads
                    </h2>
                    <p className="text-slate-600 mt-2">Leads created by you - completely private and secure</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Your Data Only</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Owner: {userInfo.firstName}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Table onDataChange={fetchDashboardData} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard;
