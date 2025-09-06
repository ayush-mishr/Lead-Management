import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import { useSelector } from 'react-redux';

ModuleRegistry.registerModules([AllCommunityModule]);

const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:4000/api/v1';

export const Table = () => {
  const { token } = useSelector((state) => state.auth);
  const [rowData, setRowData] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [newLead, setNewLead] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    is_qualified: "false", // Default string value
    last_activity: new Date().toISOString(),
  });

  // Configure axios headers for authentication
  const getAuthHeaders = () => {
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Table Columns
  const [columnDefs] = useState([
    { headerName: "First Name", field: "first_name", editable: true, filter: true },
    { headerName: "Last Name", field: "last_name", editable: true, filter: true },
    { headerName: "Email", field: "email", editable: true, filter: true },
    { headerName: "Phone", field: "phone", editable: true, filter: true },
    { headerName: "Company", field: "company", editable: true, filter: true },
    { headerName: "City", field: "city", editable: true, filter: true },
    { headerName: "State", field: "state", editable: true, filter: true },
    { headerName: "Source", field: "source", editable: true, filter: true },
    { headerName: "Status", field: "status", editable: true, filter: true },
    { headerName: "Score", field: "score", editable: true, filter: "agNumberColumnFilter" },
    { headerName: "Lead Value", field: "lead_value", editable: true, filter: "agNumberColumnFilter" },
    {
      headerName: "Last Activity",
      field: "last_activity",
      editable: false,
      valueFormatter: (params) => formatDate(params.value),
      filter: true,
    },
    {
      headerName: "Created At",
      field: "createdAt",
      editable: false,
      valueFormatter: (params) => formatDate(params.value),
      filter: true,
    },
    {
      headerName: "Updated At",
      field: "updatedAt",
      editable: false,
      valueFormatter: (params) => formatDate(params.value),
      filter: true,
    },
    {
      headerName: "Is Qualified",
      field: "is_qualified",
      editable: true,
      filter: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["true", "false"], // Dropdown values
      },
      // Always show proper true/false strings
      valueFormatter: (params) => {
        if (params.value === true || params.value === "true") return "true";
        if (params.value === false || params.value === "false") return "false";
        return "false"; // Default fallback
      },
    },
  ]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };

  // Fetch Leads with authentication
  const fetchLeads = async () => {
    if (!token) {
      console.warn('No authentication token available');
      setRowData([]);
      return;
    }
    
    try {
      const res = await axios.get(`${API_BASE_URL}/leads`, getAuthHeaders());
      const leads = res.data.data.map((lead) => ({
        ...lead,
        is_qualified: lead.is_qualified?.toString() || "false", // Always convert to string.
      }));
      setRowData(leads);
    } catch (err) {
      console.error('Error fetching leads:', err);
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        setRowData([]);
      } else if (err.response?.status === 500) {
        alert('Server error. Please try again later.');
        setRowData([]);
      } else {
        alert('Failed to fetch leads. Please try again.');
        setRowData([]);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Validation
  const validateLead = (lead, isNew = true) => {
    if (!lead.first_name || !lead.last_name || !lead.email) {
      alert("First name, last name, and email are required.");
      return false;
    }
    if (lead.score < 0 || lead.score > 100) {
      alert("Score must be between 0 and 100.");
      return false;
    }
    if (lead.lead_value < 0) {
      alert("Lead value cannot be negative.");
      return false;
    }
    const duplicate = rowData.find(
      (r) => r.email === lead.email && (isNew || r._id !== lead._id)
    );
    if (duplicate) {
      alert("Email must be unique.");
      return false;
    }
    return true;
  };

  // Create Lead with authentication
  const createLead = async () => {
    if (!token) {
      alert('Please login to add leads.');
      return;
    }
    
    if (!validateLead(newLead)) return;
    
    try {
      const payload = {
        ...newLead,
        is_qualified: newLead.is_qualified.toString(),
        last_activity: new Date().toISOString(),
      };
      await axios.post(`${API_BASE_URL}/leads`, payload, getAuthHeaders());
      alert("Lead added!");
      fetchLeads();
      setNewLead({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        state: "",
        source: "website",
        status: "new",
        score: 0,
        lead_value: 0,
        is_qualified: "false",
        last_activity: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error creating lead:', err);
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
      } else if (err.response?.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert('Failed to add lead. Please try again.');
      }
    }
  };

  // Update Lead with authentication
  const updateLead = async () => {
    if (!token) {
      alert('Please login to update leads.');
      return;
    }
    
    if (!selectedLead) return alert("Select a lead to update!");
    if (!validateLead(selectedLead, false)) return;
    
    try {
      const payload = {
        ...selectedLead,
        is_qualified: selectedLead.is_qualified.toString(),
        last_activity: new Date().toISOString(),
      };
      await axios.put(
        `${API_BASE_URL}/leads/${selectedLead._id}`,
        payload,
        getAuthHeaders()
      );
      alert("Lead updated!");
      fetchLeads();
    } catch (err) {
      console.error('Error updating lead:', err);
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
      } else if (err.response?.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert('Failed to update lead. Please try again.');
      }
    }
  };

  // Delete Lead with authentication
  const deleteLead = async () => {
    if (!token) {
      alert('Please login to delete leads.');
      return;
    }
    
    if (!selectedLead) return alert("Select a lead to delete!");
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      await axios.delete(
        `${API_BASE_URL}/leads/${selectedLead._id}`,
        getAuthHeaders()
      );
      alert("Lead deleted!");
      fetchLeads();
    } catch (err) {
      console.error('Error deleting lead:', err);
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
      } else if (err.response?.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert('Failed to delete lead. Please try again.');
      }
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onQuickFilterChange = (e) => {
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        {/* Compact Header Section */}
        <div className="mb-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  📊 Lead Management Dashboard
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage and track your leads
                </p>
              </div>
              <div className="text-right">
                <div className="bg-blue-50 rounded-lg px-3 py-2">
                  <span className="text-blue-600 font-semibold text-sm">{rowData.length} Total Leads</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-140px)]">
          {/* Main Table Section - Takes 3/4 of width */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              {/* Table Header */}
              <div className="bg-blue-600 p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Lead Pipeline</h2>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Quick Filter..."
                      onChange={onQuickFilterChange}
                      className="px-3 py-1 rounded border bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* AG Grid - Fills remaining space */}
              <div className="flex-1 p-4">
                <div className="ag-theme-quartz h-full w-full rounded overflow-hidden">
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={20}
                    paginationPageSizeSelector={[10, 20, 50, 100]}
                    rowSelection="multiple"
                    theme="legacy"
                    onSelectionChanged={(params) =>
                      setSelectedLead(params.api.getSelectedRows()[0])
                    }
                    onGridReady={onGridReady}
                    suppressRowClickSelection={false}
                    rowMultiSelectWithClick={true}
                    animateRows={true}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-3 mt-4">
                  <button
                    onClick={updateLead}
                    className="px-6 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                  >
                    Update Selected
                  </button>
                  <button
                    onClick={deleteLead}
                    className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Lead Form - Takes 1/4 of width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              {/* Form Header */}
              <div className="bg-green-600 p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold text-white">
                  Add New Lead
                </h3>
                <p className="text-green-100 text-xs mt-1">Fill in the details below</p>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  {/* Primary Fields */}
                  {[
                    { name: "first_name", label: "First Name", type: "text" },
                    { name: "last_name", label: "Last Name", type: "text" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "phone", label: "Phone", type: "tel" }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={newLead[field.name]}
                        onChange={(e) => setNewLead({ ...newLead, [field.name]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}

                  {/* Company and Source */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={newLead.company}
                        onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Company"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Source
                      </label>
                      <select
                        value={newLead.source}
                        onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="website">Website</option>
                        <option value="social_media">Social Media</option>
                        <option value="referral">Referral</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={newLead.city}
                        onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={newLead.state}
                        onChange={(e) => setNewLead({ ...newLead, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  {/* Score and Lead Value */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Score (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newLead.score}
                        onChange={(e) => setNewLead({ ...newLead, score: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Lead Value ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newLead.lead_value}
                        onChange={(e) => setNewLead({ ...newLead, lead_value: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Status and Is Qualified */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={newLead.status}
                        onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="lost">Lost</option>
                        <option value="won">Won</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Is Qualified
                      </label>
                      <select
                        value={newLead.is_qualified}
                        onChange={(e) => setNewLead({ ...newLead, is_qualified: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="true">Yes - Qualified</option>
                        <option value="false">No - Not Qualified</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={createLead}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
