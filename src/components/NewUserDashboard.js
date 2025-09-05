import React from 'react'
import { useSelector } from 'react-redux'
import FirstLeadForm from './FirstLeadForm'

const NewUserDashboard = ({ onFirstLeadAdded }) => {
  const { signupData } = useSelector((state) => state.auth);
  
  // Get user info for new user dashboard
  const userInfo = {
    firstName: signupData?.firstName || 'New User',
    lastName: signupData?.lastName || '',
    email: signupData?.email || ''
  };

  // Empty table data for new users
  const emptyTableData = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* New User Dashboard Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Welcome to Lead Management, {userInfo.firstName}!
                </h1>
                <p className="text-sm text-slate-600 mt-2">
                  🎉 Congratulations on creating your account! Get started by adding your first lead.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {userInfo.firstName} {userInfo.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{userInfo.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    New User
                  </span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {userInfo.firstName.charAt(0).toUpperCase()}{userInfo.lastName ? userInfo.lastName.charAt(0).toUpperCase() : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card for New Users */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🚀 Ready to Get Started?
                </h3>
                <p className="text-green-700 mb-4">
                  Your lead management journey begins here! You currently have no leads in your system, 
                  but that's about to change. Start by adding your first lead to see how powerful this system can be.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-green-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Track and manage all your leads in one place
                  </div>
                  <div className="flex items-center text-sm text-green-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Monitor qualification status and conversion rates
                  </div>
                  <div className="flex items-center text-sm text-green-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Export and analyze your lead data
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats at Top - All Zero for New Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/30 hover:shadow-2xl transition-all duration-300">
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
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/30 hover:shadow-2xl transition-all duration-300">
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
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty Table for New Users */}
        <div className="w-full bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/40 overflow-hidden">
          <div className="p-8">
            <div className="mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                Your Lead Management Table
              </h2>
              <p className="text-slate-600 mt-2">This is where all your leads will appear once you start adding them</p>
            </div>
            
            {/* Empty State */}
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Leads Yet</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                You haven't added any leads to your system yet. Once you add your first lead, 
                it will appear in this table where you can manage, edit, and track all your leads.
              </p>
              
              {/* Table Headers Preview */}
              <div className="bg-slate-50 rounded-lg p-4 max-w-4xl mx-auto">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-slate-600 mb-2">
                  <div className="text-left">Name</div>
                  <div className="text-left">Email</div>
                  <div className="text-left">Company</div>
                  <div className="text-left">Status</div>
                  <div className="text-left">Actions</div>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <div className="text-slate-400 text-sm italic">Your leads will appear here...</div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    🚀 Add Your First Lead
                  </h3>
                  <FirstLeadForm onLeadAdded={onFirstLeadAdded} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewUserDashboard
