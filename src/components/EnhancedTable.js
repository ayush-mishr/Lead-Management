import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

ModuleRegistry.registerModules([AllCommunityModule]);

export const EnhancedTable = ({ onDataChange }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  
  // Grid state
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const gridRef = useRef(null);

  // Form state for adding new leads
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    source: 'website',
    status: 'new',
    score: 0,
    lead_value: 0,
    is_qualified: 'false',
    last_activity: new Date().toISOString(),
  });

  // Date formatter utility
  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }, []);

  // Memoized column definitions for AG Grid
  const columnDefs = useMemo(() => [
    { 
      headerName: 'First Name', 
      field: 'first_name', 
      editable: true, 
      filter: true,
      minWidth: 120,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    { 
      headerName: 'Last Name', 
      field: 'last_name', 
      editable: true, 
      filter: true,
      minWidth: 120
    },
    { 
      headerName: 'Email', 
      field: 'email', 
      editable: true, 
      filter: true,
      minWidth: 200
    },
    { 
      headerName: 'Phone', 
      field: 'phone', 
      editable: true, 
      filter: true,
      minWidth: 140
    },
    { 
      headerName: 'Company', 
      field: 'company', 
      editable: true, 
      filter: true,
      minWidth: 150
    },
    { 
      headerName: 'City', 
      field: 'city', 
      editable: true, 
      filter: true,
      minWidth: 120
    },
    { 
      headerName: 'State', 
      field: 'state', 
      editable: true, 
      filter: true,
      minWidth: 100
    },
    { 
      headerName: 'Source', 
      field: 'source', 
      editable: true, 
      filter: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['website', 'referral', 'social', 'email', 'phone', 'event', 'other']
      },
      minWidth: 120
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      editable: true, 
      filter: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed', 'lost']
      },
      minWidth: 130
    },
    { 
      headerName: 'Score', 
      field: 'score', 
      editable: true, 
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      minWidth: 100
    },
    { 
      headerName: 'Lead Value', 
      field: 'lead_value', 
      editable: true, 
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return `$${parseFloat(params.value).toLocaleString()}`;
      },
      minWidth: 120
    },
    {
      headerName: 'Qualified',
      field: 'is_qualified',
      editable: true,
      filter: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['true', 'false']
      },
      valueFormatter: (params) => {
        return params.value === true || params.value === 'true' ? 'Yes' : 'No';
      },
      cellStyle: (params) => {
        if (params.value === true || params.value === 'true') {
          return { backgroundColor: '#dcfce7', color: '#166534' };
        }
        return { backgroundColor: '#fef2f2', color: '#dc2626' };
      },
      minWidth: 100
    },
    {
      headerName: 'Last Activity',
      field: 'last_activity',
      editable: false,
      valueFormatter: (params) => formatDate(params.value),
      filter: 'agDateColumnFilter',
      minWidth: 150
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      editable: false,
      valueFormatter: (params) => formatDate(params.value),
      filter: 'agDateColumnFilter',
      minWidth: 150
    },
    {
      headerName: 'Updated',
      field: 'updatedAt',
      editable: false,
      valueFormatter: (params) => formatDate(params.value),
      filter: 'agDateColumnFilter',
      minWidth: 150
    }
  ], [formatDate]);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    floatingFilter: true,
    flex: 1,
    minWidth: 100,
  }), []);

  // Grid options
  const gridOptions = useMemo(() => ({
    animateRows: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    pagination: true,
    paginationPageSize: 20,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    enableRangeSelection: true,
    editType: 'fullRow',
    rowHeight: 50,
    headerHeight: 50,
  }), []);

  // API configuration for authenticated requests
  const getApiConfig = useCallback(() => {
    if (!token) return null;
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }, [token]);

  // Fetch user-specific leads
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!token) {
        setRowData([]);
        if (onDataChange) onDataChange();
        return;
      }

      const config = getApiConfig();
      if (!config) return;

      const response = await axios.get(
        'https://lead-management-2-wnen.onrender.com/api/v1/leads',
        config
      );

      const leads = response.data.data.map(lead => ({
        ...lead,
        is_qualified: lead.is_qualified?.toString() || 'false'
      }));

      setRowData(leads);
      if (onDataChange) onDataChange();
      
    } catch (error) {
      console.error('Error fetching leads:', error);
      setRowData([]);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to load leads');
      }
      
      if (onDataChange) onDataChange();
    } finally {
      setLoading(false);
    }
  }, [token, getApiConfig, onDataChange]);

  // Create new lead
  const createLead = useCallback(async (leadData) => {
    try {
      const config = getApiConfig();
      if (!config) return;

      const response = await axios.post(
        'https://lead-management-2-wnen.onrender.com/api/v1/leads',
        leadData,
        config
      );

      toast.success('Lead created successfully!');
      await fetchLeads(); // Refresh the grid
      return response.data.data;
      
    } catch (error) {
      console.error('Error creating lead:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('email')) {
        toast.error('You already have a lead with this email address');
      } else {
        toast.error('Failed to create lead');
      }
      throw error;
    }
  }, [getApiConfig, fetchLeads]);

  // Update lead
  const updateLead = useCallback(async (leadId, updates) => {
    try {
      const config = getApiConfig();
      if (!config) return;

      const response = await axios.put(
        `https://lead-management-2-wnen.onrender.com/api/v1/leads/${leadId}`,
        updates,
        config
      );

      toast.success('Lead updated successfully!');
      return response.data.data;
      
    } catch (error) {
      console.error('Error updating lead:', error);
      if (error.response?.status === 404) {
        toast.error('Lead not found or access denied');
      } else if (error.response?.status === 400 && error.response?.data?.message?.includes('email')) {
        toast.error('You already have a lead with this email address');
      } else {
        toast.error('Failed to update lead');
      }
      throw error;
    }
  }, [getApiConfig]);

  // Delete leads
  const deleteLeads = useCallback(async (leadIds) => {
    try {
      const config = getApiConfig();
      if (!config) return;

      const deletePromises = leadIds.map(id => 
        axios.delete(
          `https://lead-management-2-wnen.onrender.com/api/v1/leads/${id}`,
          config
        )
      );

      await Promise.all(deletePromises);
      toast.success(`${leadIds.length} lead(s) deleted successfully!`);
      await fetchLeads(); // Refresh the grid
      
    } catch (error) {
      console.error('Error deleting leads:', error);
      toast.error('Failed to delete leads');
      throw error;
    }
  }, [getApiConfig, fetchLeads]);

  // Grid event handlers
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  }, []);

  const onCellValueChanged = useCallback(async (event) => {
    if (!event.data || !event.data._id) return;
    
    try {
      const updates = {
        [event.colDef.field]: event.newValue,
        last_activity: new Date().toISOString()
      };
      
      await updateLead(event.data._id, updates);
      if (onDataChange) onDataChange();
      
    } catch (error) {
      // Revert the change in the grid
      event.node.setDataValue(event.colDef.field, event.oldValue);
    }
  }, [updateLead, onDataChange]);

  const onRowEditingStopped = useCallback((event) => {
    // Additional validation or processing after row editing
  }, []);

  // Form handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewLead(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmitNewLead = useCallback(async (e) => {
    e.preventDefault();
    try {
      await createLead(newLead);
      setNewLead({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        city: '',
        state: '',
        source: 'website',
        status: 'new',
        score: 0,
        lead_value: 0,
        is_qualified: 'false',
        last_activity: new Date().toISOString(),
      });
      setShowAddForm(false);
    } catch (error) {
      // Error already handled in createLead
    }
  }, [createLead, newLead]);

  const handleDeleteSelected = useCallback(async () => {
    if (!gridApi) return;
    
    const selectedNodes = gridApi.getSelectedNodes();
    if (selectedNodes.length === 0) {
      toast.error('Please select leads to delete');
      return;
    }

    const leadIds = selectedNodes.map(node => node.data._id);
    
    if (window.confirm(`Are you sure you want to delete ${leadIds.length} lead(s)?`)) {
      await deleteLeads(leadIds);
    }
  }, [gridApi, deleteLeads]);

  const handleExportData = useCallback(() => {
    if (!gridApi) return;
    
    gridApi.exportDataAsCsv({
      fileName: `leads-${user?.firstName || 'user'}-${new Date().toISOString().split('T')[0]}.csv`,
      skipColumnGroupHeaders: true,
      skipColumnHeaders: false
    });
  }, [gridApi, user]);

  // Initialize data on component mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (gridApi) {
        gridApi.sizeColumnsToFit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gridApi]);

  // Don't render if no authentication
  if (!token) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view your leads</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Leads ({rowData.length})
          </h2>
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Lead
          </button>
          
          <button
            onClick={handleDeleteSelected}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Selected
          </button>
          
          <button
            onClick={handleExportData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          
          <button
            onClick={fetchLeads}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* AG Grid */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="ag-theme-quartz" style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            onRowEditingStopped={onRowEditingStopped}
            loadingOverlayComponent="agLoadingOverlay"
            noRowsOverlayComponent={() => (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No leads yet</div>
                <p className="text-gray-500 text-sm">
                  Add your first lead to get started with your pipeline
                </p>
              </div>
            )}
          />
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Add New Lead</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitNewLead} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      name="first_name"
                      value={newLead.first_name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      name="last_name"
                      value={newLead.last_name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={newLead.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={newLead.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={newLead.company}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={newLead.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={newLead.state}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source</label>
                    <select
                      name="source"
                      value={newLead.source}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="social">Social Media</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="event">Event</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={newLead.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed">Closed</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Score</label>
                    <input
                      type="number"
                      name="score"
                      value={newLead.score}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lead Value</label>
                    <input
                      type="number"
                      name="lead_value"
                      value={newLead.lead_value}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Qualified</label>
                    <select
                      name="is_qualified"
                      value={newLead.is_qualified}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
