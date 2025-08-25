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
  const [newLead, setNewLead] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",  // default selected
    status: "new",      // default selected
    score: 50,          // default value
    lead_value: 1000,   // default value
    is_qualified: false, // default
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const [columnDefs] = useState([
    { headerName: "First Name", field: "first_name", editable: true },
    { headerName: "Last Name", field: "last_name", editable: true },
    { headerName: "Email", field: "email", editable: true },
    { headerName: "Phone", field: "phone", editable: true },
    { headerName: "Company", field: "company", editable: true },
    { headerName: "City", field: "city", editable: true },
    { headerName: "State", field: "state", editable: true },
    { headerName: "Source", field: "source", editable: true },
    { headerName: "Status", field: "status", editable: true },
    { headerName: "Score", field: "score", editable: true },
    { headerName: "Lead Value", field: "lead_value", editable: true },
    { headerName: "Last Activity", field: "last_activity", editable: false, valueFormatter: (params) => formatDate(params.value) },
    { headerName: "Created At", field: "createdAt", editable: false, valueFormatter: (params) => formatDate(params.value) },
    { headerName: "Updated At", field: "updatedAt", editable: false, valueFormatter: (params) => formatDate(params.value) },
    { headerName: "Is Qualified", field: "is_qualified", editable: true, valueFormatter: (params) => params.value ? "Qualified" : "Disqualified" },
  ]);

  const defaultColDef = { sortable: true, resizable: true, floatingFilter: true, checkboxSelection: true };

  const fetchLeads = async () => {
    try {
      const res = await axios.get("https://lead-management-2-wnen.onrender.com/api/v1/leads");
      setRowData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const validateLead = (lead, isNew = true) => {
    if (!lead.first_name || !lead.last_name || !lead.email) { alert("First name, last name, and email are required."); return false; }
    if (lead.score < 0 || lead.score > 100) { alert("Score must be 0-100."); return false; }
    if (lead.lead_value < 0) { alert("Lead value cannot be negative."); return false; }
    const duplicate = rowData.find(r => r.email === lead.email && (isNew || r._id !== lead._id));
    if (duplicate) { alert("Email must be unique."); return false; }
    return true;
  };

  const createLead = async () => {
    if (!validateLead(newLead)) return;
    try {
      await axios.post("https://lead-management-2-wnen.onrender.com/api/v1/leads", newLead);
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
        lead_value:0,
        is_qualified: false,
      });
    } catch (err) { console.error(err); alert("Failed to add lead."); }
  };

  const updateLead = async () => {
    if (!selectedLead) return alert("Select a lead to update!");
    if (!validateLead(selectedLead, false)) return;
    try {
      await axios.put(`https://lead-management-2-wnen.onrender.com/api/v1/leads/${selectedLead._id}`, selectedLead);
      alert("Lead updated!");
      fetchLeads();
    } catch (err) { console.error(err); alert("Failed to update lead."); }
  };

  const deleteLead = async () => {
    if (!selectedLead) return alert("Select a lead to delete!");
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`https://lead-management-2-wnen.onrender.com/api/v1/leads/${selectedLead._id}`);
      alert("Lead deleted!");
      fetchLeads();
    } catch (err) { console.error(err); alert("Failed to delete lead."); }
  };

  return (
    <div className="flex gap-6 p-4">
      {/* AG Grid Section */}
      <div className="w-3/4">
        <h2 className="text-2xl font-bold mb-3">Lead Management</h2>
        <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            rowSelection="multiple"
            onSelectionChanged={(params) => setSelectedLead(params.api.getSelectedRows()[0])}
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={updateLead} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">Update Selected</button>
          <button onClick={deleteLead} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Delete Selected</button>
        </div>
      </div>

      {/* Add New Lead Form */}
      <div className="w-1/4 bg-gray-100 shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Add New Lead</h3>
        <div className="flex flex-col gap-2">
          {["first_name","last_name","email","phone","company","city","state"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.replace("_"," ").replace(/\b\w/g,l=>l.toUpperCase())}
              value={newLead[field]}
              onChange={(e) => setNewLead({...newLead,[field]:e.target.value})}
              className="border p-1 text-sm rounded"
            />
          ))}

          <input
            type="number"
            placeholder="Score"
            value={newLead.score}
            onChange={(e) => setNewLead({...newLead, score: Number(e.target.value)})}
            className="border p-1 text-sm rounded"
          />
          <input
            type="number"
            placeholder="Lead Value"
            value={newLead.lead_value}
            onChange={(e) => setNewLead({...newLead, lead_value: Number(e.target.value)})}
            className="border p-1 text-sm rounded"
          />

          <select value={newLead.source} onChange={(e) => setNewLead({...newLead, source: e.target.value})} className="border p-1 text-sm rounded">
            <option value="website">Website</option>
            <option value="facebook_ads">Facebook Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="referral">Referral</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>

          <select value={newLead.status} onChange={(e) => setNewLead({...newLead, status: e.target.value})} className="border p-1 text-sm rounded">
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>

          {/* Qualified / Disqualified dropdown */}
          <select
            value={newLead.is_qualified ? "qualified" : "disqualified"}
            onChange={(e) =>
              setNewLead({
                ...newLead,
                is_qualified: e.target.value === "qualified",
              })
            }
            className="border p-1 text-sm rounded"
          >
            <option value="qualified">Qualified</option>
            <option value="disqualified">Disqualified</option>
          </select>

          <button onClick={createLead} className="bg-green-600 hover:bg-green-700 text-white p-2 mt-2 rounded">Add Lead</button>
        </div>
      </div>
    </div>
  );
};
