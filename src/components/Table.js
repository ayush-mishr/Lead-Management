import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import { useSelector } from 'react-redux';

ModuleRegistry.registerModules([AllCommunityModule]);
export const Table = ({ onDataChange }) => {
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

  // Fetch Leads - Only user-specific data
  const fetchLeads = async () => {
    try {
      // For users without token, don't fetch any data
      if (!token) {
        setRowData([]);
        if (onDataChange) {
          onDataChange();
        }
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Always require authentication
        }
      };
      
      const res = await axios.get("https://lead-management-2-wnen.onrender.com/api/v1/leads", config);
      
      // Only get user's own leads - the API should filter by user
      const leads = res.data.data.map((lead) => ({
        ...lead,
        is_qualified: lead.is_qualified?.toString() || "false", // Always convert to string.
      }));
      
      setRowData(leads);
      
      // Notify parent component about data change
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      
      // For any error (including unauthorized), ensure empty data
      setRowData([]);
      
      if (err.response?.status === 401) {
        console.error("Unauthorized access. User needs to login again.");
      }
      
      // Still notify parent to update stats to 0
      if (onDataChange) {
        onDataChange();
      }
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Enhanced empty state component for new users
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-200">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Personal Lead Management Starts Here!</h3>
        <p className="text-gray-600 mb-1">Welcome to your private dashboard. This space is exclusively yours.</p>
        <p className="text-sm text-gray-500 mb-6">Add your first lead below to start tracking and managing your business opportunities.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => document.getElementById('add-lead-form').scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Lead
          </button>
          <div className="text-xs text-gray-400 self-center">
            ✨ Start building your lead pipeline today
          </div>
        </div>
      </div>
    </div>
  );

  // Validation - Updated for user-specific emails
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
    
    // Check for duplicate email in current user's leads
    const duplicate = rowData.find(
      (r) => r.email === lead.email && (isNew || r._id !== lead._id)
    );
    if (duplicate) {
      alert("You already have a lead with this email address.");
      return false;
    }
    return true;
  };

  // Create Lead
  const createLead = async () => {
    if (!validateLead(newLead)) return;
    try {
      const config = {
        headers: {}
      };
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const payload = {
        ...newLead,
        is_qualified: newLead.is_qualified.toString(),
        last_activity: new Date().toISOString(),
      };
      await axios.post("https://lead-management-2-wnen.onrender.com/api/v1/leads", payload, config);
      alert("Lead added successfully!");
      fetchLeads();
      
      // Notify parent component
      if (onDataChange) {
        onDataChange();
      }
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
      console.error("Error creating lead:", err);
      const errorMessage = err.response?.data?.message || "Failed to add lead.";
      alert(errorMessage);
    }
  };

  // Update Lead
  const updateLead = async () => {
    if (!selectedLead) return alert("Select a lead to update!");
    if (!validateLead(selectedLead, false)) return;
    try {
      const config = {
        headers: {}
      };
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const payload = {
        ...selectedLead,
        is_qualified: selectedLead.is_qualified.toString(),
        last_activity: new Date().toISOString(),
      };
      await axios.put(
        `https://lead-management-2-wnen.onrender.com/api/v1/leads/${selectedLead._id}`,
        payload,
        config
      );
      alert("Lead updated successfully!");
      fetchLeads();
      
      // Notify parent component
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      console.error("Error updating lead:", err);
      const errorMessage = err.response?.data?.message || "Failed to update lead.";
      alert(errorMessage);
    }
  };

  // Delete Lead
  const deleteLead = async () => {
    if (!selectedLead) return alert("Select a lead to delete!");
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const config = {
        headers: {}
      };
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      await axios.delete(
        `https://lead-management-2-wnen.onrender.com/api/v1/leads/${selectedLead._id}`,
        config
      );
      alert("Lead deleted successfully!");
      fetchLeads();
      
      // Notify parent component
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      console.error("Error deleting lead:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete lead.";
      alert(errorMessage);
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
    <div className="flex gap-6 p-4">
      {/* AG Grid Section */}
      <div className="w-3/4">
        <h2 className="text-2xl font-bold mb-3">Lead Management</h2>



        {/* Search */}
        <input
          type="text"
          placeholder="Search leads..."
          onChange={onQuickFilterChange}
          className="mb-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

        {/* Table or Empty State */}
        {rowData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 25, 50, 100]}
              rowSelection="multiple"
              theme="legacy"
              onSelectionChanged={(params) =>
                setSelectedLead(params.api.getSelectedRows()[0])
              }
              onGridReady={onGridReady}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={updateLead}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Update Selected
          </button>
          <button
            onClick={deleteLead}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* Add Lead Form */}
      <div id="add-lead-form" className="w-1/4 bg-gray-100 shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Add New Lead</h3>
        <div className="flex flex-col gap-3">
          {[{ name: "first_name", label: "First Name" },
            { name: "last_name", label: "Last Name" },
            { name: "email", label: "Email" },
            { name: "phone", label: "Phone" }].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm font-semibold">{field.label}</label>
              <input
                type="text"
                value={newLead[field.name]}
                onChange={(e) => setNewLead({ ...newLead, [field.name]: e.target.value })}
                className="border p-1 text-sm rounded"
              />
            </div>
          ))}

          {/* Two-Column Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Company</label>
              <input
                type="text"
                value={newLead.company}
                onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                className="border p-1 text-sm rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold">City</label>
              <input
                type="text"
                value={newLead.city}
                onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                className="border p-1 text-sm rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold">State</label>
              <input
                type="text"
                value={newLead.state}
                onChange={(e) => setNewLead({ ...newLead, state: e.target.value })}
                className="border p-1 text-sm rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Score</label>
              <input
                type="number"
                value={newLead.score}
                onChange={(e) => setNewLead({ ...newLead, score: Number(e.target.value) })}
                className="border p-1 text-sm rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold">Lead Value</label>
              <input
                type="number"
                value={newLead.lead_value}
                onChange={(e) => setNewLead({ ...newLead, lead_value: Number(e.target.value) })}
                className="border p-1 text-sm rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Source</label>
              <select
                value={newLead.source}
                onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                className="border p-1 text-sm rounded"
              >
                <option value="website">Website</option>
                <option value="facebook_ads">Facebook Ads</option>
                <option value="google_ads">Google Ads</option>
                <option value="referral">Referral</option>
                <option value="events">Events</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold">Status</label>
              <select
                value={newLead.status}
                onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                className="border p-1 text-sm rounded"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
                <option value="won">Won</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold">Is Qualified</label>
              <select
                value={newLead.is_qualified}
                onChange={(e) =>
                  setNewLead({ ...newLead, is_qualified: e.target.value })
                }
                className="border p-1 text-sm rounded"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>

          <button
            onClick={createLead}
            className="bg-green-600 hover:bg-green-700 text-white p-2 mt-3 rounded"
          >
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
};
