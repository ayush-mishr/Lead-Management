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
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    is_qualified: false,
  });

  const [columnDefs] = useState([
    { headerName: "First Name", field: "first_name", editable: true },
    { headerName: "Last Name", field: "last_name", editable: true },
    {
      headerName: "Email",
      field: "email",
      editable: true,
      filter: "agTextColumnFilter",
      filterParams: { filterOptions: ["contains", "equals"], debounceMs: 200 },
    },
    { headerName: "Phone", field: "phone", editable: true },
    {
      headerName: "Company",
      field: "company",
      editable: true,
      filter: "agTextColumnFilter",
      filterParams: { filterOptions: ["contains", "equals"], debounceMs: 200 },
    },
    {
      headerName: "City",
      field: "city",
      editable: true,
      filter: "agTextColumnFilter",
      filterParams: { filterOptions: ["contains", "equals"], debounceMs: 200 },
    },
    { headerName: "State", field: "state", editable: true },
    {
      headerName: "Source",
      field: "source",
      editable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["website", "facebook_ads", "google_ads", "referral", "events", "other"],
      },
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["new", "contacted", "qualified", "lost", "won"],
      },
    },
    {
      headerName: "Score",
      field: "score",
      editable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        filterOptions: ["equals", "greaterThan", "lessThan", "inRange"],
      },
    },
    {
      headerName: "Lead Value",
      field: "lead_value",
      editable: true,
      filter: "agNumberColumnFilter",
      filterParams: {
        filterOptions: ["equals", "greaterThan", "lessThan", "inRange"],
      },
    },
    {
      headerName: "Last Activity",
      field: "last_activity",
      editable: false,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = cellValue ? new Date(cellValue) : null;
          if (!cellDate) return 0;
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
          return 0;
        },
        browserDatePicker: true,
      },
    },
    {
      headerName: "Created At",
      field: "created_at",
      editable: false,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = cellValue ? new Date(cellValue) : null;
          if (!cellDate) return 0;
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
          return 0;
        },
        browserDatePicker: true,
      },
    },
    {
      headerName: "Updated At",
      field: "updated_at",
      editable: false,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = cellValue ? new Date(cellValue) : null;
          if (!cellDate) return 0;
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
          return 0;
        },
        browserDatePicker: true,
      },
    },
    {
      headerName: "Is Qualified",
      field: "is_qualified",
      editable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: [true, false],
      },
    },
  ]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: true,
    checkboxSelection: true,
  };

  // Fetch all leads
  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/leads");
      setRowData(res.data.data);
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Validation helper
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

  // Add new lead
  const createLead = async () => {
    if (!validateLead(newLead)) return;

    try {
      await axios.post("http://localhost:4000/api/v1/leads", newLead);
      alert("Lead added successfully!");
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
        is_qualified: false,
      });
    } catch (err) {
      console.error("Error creating lead:", err);
      alert("Failed to add lead.");
    }
  };

  // Update selected lead
  const updateLead = async () => {
    if (!selectedLead) {
      alert("Please select a lead to update!");
      return;
    }
    if (!validateLead(selectedLead, false)) return;

    try {
      await axios.put(
        `http://localhost:4000/api/v1/leads/${selectedLead._id}`,
        selectedLead
      );
      alert("Lead updated successfully!");
      fetchLeads();
    } catch (err) {
      console.error("Error updating lead:", err);
      alert("Failed to update lead.");
    }
  };

  // Delete selected lead
  const deleteLead = async () => {
    if (!selectedLead) {
      alert("Please select a lead to delete!");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/v1/leads/${selectedLead._id}`
      );
      alert("Lead deleted successfully!");
      fetchLeads();
    } catch (err) {
      console.error("Error deleting lead:", err);
      alert("Failed to delete lead.");
    }
  };

  return (
    <div className="flex gap-6 p-4">
      {/* Left side - AG Grid */}
      <div className="w-3/4">
        <h2 className="text-2xl font-bold mb-3">Lead Management</h2>
        <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            rowSelection="single"
            onSelectionChanged={(params) =>
              setSelectedLead(params.api.getSelectedRows()[0])
            }
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

      {/* Right side - Add new lead form */}
      <div className="w-1/4 bg-gray-100 shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Add New Lead</h3>
        <div className="flex flex-col gap-2">
          {[
            "first_name",
            "last_name",
            "email",
            "phone",
            "company",
            "city",
            "state",
            "score",
            "lead_value",
          ].map((field) => (
            <input
              key={field}
              type={field.includes("score") || field.includes("value") ? "number" : "text"}
              placeholder={field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              value={newLead[field]}
              onChange={(e) =>
                setNewLead({ ...newLead, [field]: e.target.value })
              }
              className="border p-1 text-sm rounded"
            />
          ))}

          {/* Source dropdown */}
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

          {/* Status dropdown */}
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

          <button
            onClick={createLead}
            className="bg-green-600 hover:bg-green-700 text-white p-2 mt-2 rounded"
          >
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
};
