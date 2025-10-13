/*
Sibulele Nohamba
220374686
Date: 25/08/2025
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Common/Header";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import "../../assets/styling/Global.css";
import "../../assets/styling/Dashboard.css";
import "../../assets/styling/Sidebar.css";
import { getAllMaintenance, createMaintenance } from "../../services/maintenanceService";

export default function MaintenanceComponent() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ carId: "", date: "", type: "" });

  async function load() {
    const data = await getAllMaintenance();
    setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function onAdd(e) {
    e.preventDefault();
    await createMaintenance({
      carId: Number(form.carId),
      date: form.date,
      type: form.type,
      status: "Completed"
    });
    setForm({ carId: "", date: "", type: "" });
    await load();
  }

  const featured = items[0];

  return (
    <>
      <Header />
      <Navigation />

      <main className="main-content">
        <div className="dashboard-container">
          <h1>Maintenance</h1>

          {/* Featured maintenance card */}
          <div className="quick-actions" style={{ marginBottom: "30px" }}>
            {featured ? (
              <>
                <h3>Latest Maintenance Record</h3>
                <p><strong>Vehicle ID:</strong> {featured.carId}</p>
                <p><strong>Date:</strong> {(featured.date || "").slice(0, 10)}</p>
                <p><strong>Description:</strong> {featured.type}</p>
                <button
                  className="action-btn"
                  onClick={() => navigate(/maintenance/${featured.id}/edit)}
                >
                  View Details
                </button>
              </>
            ) : (
              <p>No maintenance records yet.</p>
            )}
          </div>

          {/* Add form */}
          <div className="quick-actions">
            <h3>Add New Maintenance</h3>
            <form onSubmit={onAdd}>
              <div className="form-group">
                <label>Vehicle ID</label>
                <input
                  type="text"
                  value={form.carId}
                  onChange={(e) => setForm({ ...form, carId: e.target.value })}
                  placeholder="Enter Vehicle ID"
                />
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <label>Description</label>
                <input
                  type="text"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  placeholder="e.g. Oil Change"
                />
              </div>
              <button type="submit" className="submit-btn">
                Add Maintenance
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
