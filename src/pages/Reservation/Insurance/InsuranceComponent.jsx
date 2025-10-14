/*
Sibulele Nohamba
220374686
Date: 31/08/2025
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Common/Header";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import "../../assets/styling/Global.css";
import "../../assets/styling/Dashboard.css";
import "../../assets/styling/Sidebar.css";
import { getAllInsurance, createInsurance } from "../../services/insuranceService";

export default function InsuranceComponent() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ providerName: "", policyNumber: "", endDate: "" });

  async function load() {
    const data = await getAllInsurance();
    setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function onAdd(e) {
    e.preventDefault();
    await createInsurance(form);
    setForm({ providerName: "", policyNumber: "", endDate: "" });
    await load();
  }

  const featured = items[0];

  return (
    <>
      <Header />
      <Navigation />

      <main className="main-content">
        <div className="dashboard-container">
          <h1>Insurance</h1>

          {/* Featured insurance card */}
          <div className="quick-actions" style={{ marginBottom: "30px" }}>
            {featured ? (
              <>
                <h3>Active Policy</h3>
                <p><strong>Provider:</strong> {featured.providerName}</p>
                <p><strong>Policy Number:</strong> {featured.policyNumber}</p>
                <p><strong>Expiry Date:</strong> {(featured.endDate || "").slice(0, 10)}</p>
                <button
                  className="action-btn"
                  onClick={() => navigate(/insurance/${featured.id}/edit)}
                >
                  View Details
                </button>
              </>
            ) : (
              <p>No insurance policies yet.</p>
            )}
          </div>

          {/* Add insurance form */}
          <div className="quick-actions">
            <h3>Add New Insurance</h3>
            <form onSubmit={onAdd}>
              <div className="form-group">
                <label>Provider</label>
                <input
                  type="text"
                  value={form.providerName}
                  onChange={(e) => setForm({ ...form, providerName: e.target.value })}
                  placeholder="e.g. Hollard"
                />
                <label>Policy Number</label>
                <input
                  type="text"
                  value={form.policyNumber}
                  onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
                  placeholder="Enter Policy Number"
                />
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              <button type="submit" className="submit-btn">
                Add Policy
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
