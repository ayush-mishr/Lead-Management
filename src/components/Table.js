import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Table = () => {
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

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      const res = await axios.get("https://lead-management-2-wnen.onrender.com/api/v1/leads");
      const leads = res.data.data.map((lead) => ({
        ...lead,
        is_qualified: lead.is_qualified?.toString() || "false", // Always convert to string
      }));
      setRowData(leads);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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

  // Create Lead
  const createLead = async () => {
    if (!validateLead(newLead)) return;
    try {
      const payload = {
        ...newLead,
        is_qualified: newLead.is_qualified.toString(),
        last_activity: new Date().toISOString(),
      };
      await axios.post("https://lead-management-2-wnen.onrender.com/api/v1/leads", payload);
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
      console.error(err);
      alert("Failed to add lead.");
    }
  };

  // Update Lead
  const updateLead = async () => {
    if (!selectedLead) return alert("Select a lead to update!");
    if (!validateLead(selectedLead, false)) return;
    try {
      const payload = {
        ...selectedLead,
        is_qualified: selectedLead.is_qualified.toString(),
        last_activity: new Date().toISOString(),
      };
      await axios.put(
        `https://lead-management-2-wnen.onrender.com/api/v1/leads/${selectedLead._id}`,
        payload
      );
      alert("Lead updated!");
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert("Failed to update lead.");
    }
  };

  // Delete Lead
  const deleteLead = async () => {
    if (!selectedLead) return alert("Select a lead to delete!");
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(
        `https://lead-management-2-wnen.onrender.com/api/v1/leads/${selectedLead._id}`
      );
      alert("Lead deleted!");
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert("Failed to delete lead.");
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



        {/* Table */}
        <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50, 100]}
            rowSelection="multiple"
            onSelectionChanged={(params) =>
              setSelectedLead(params.api.getSelectedRows()[0])
            }
            onGridReady={onGridReady}
          />
        </div>

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
      <div className="w-1/4 bg-gray-100 shadow-md rounded-lg p-4">
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
