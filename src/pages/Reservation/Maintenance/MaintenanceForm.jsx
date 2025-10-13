/*
Sibulele Nohamba
220374686
Date: 31/08/2025
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../Common/Header";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";

import "../../assets/styling/Global.css";
import "../../assets/styling/Dashboard.css";
import "../../assets/styling/Sidebar.css";

import {
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
} from "../../services/maintenanceService";

export default function MaintenanceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    carId: "",
    date: "",
    type: "",
    serviceCenter: "",
    cost: "",
    notes: "",
    status: "Completed",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const d = await getMaintenanceById(id);
        setForm({
          carId: String(d.carId ?? d.carID ?? ""),
          date: (d.date ?? d.serviceDate ?? "").slice(0, 10),
          type: d.type ?? d.description ?? "",
          serviceCenter: d.serviceCenter ?? "",
          cost: d.cost?.toString?.() ?? "",
          notes: d.notes ?? "",
          status: d.status ?? "Completed",
        });
      } catch (e) {
        setErr(e.message || "Failed to load maintenance record");
      }
    })();
  }, [id, isEdit]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    const payload = {
      carId: Number(form.carId),
      date: form.date,
      type: form.type,
      serviceCenter: form.serviceCenter,
      cost: form.cost ? Number(form.cost) : 0,
      notes: form.notes,
      status: form.status || "Completed",
    };

    try {
      if (isEdit) await updateMaintenance(id, payload);
      else await createMaintenance(payload);
      navigate("/maintenance");
    } catch (e) {
      setErr(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <Navigation />
      <main className="main-content">
        <div className="dashboard-container">
          <h1>{isEdit ? "Edit Maintenance" : "New Maintenance"}</h1>

          <div className="quick-actions">
            {err ? <div className="notice error">{err}</div> : null}

            <form onSubmit={onSubmit} className="form-group">
              <label>Vehicle ID</label>
              <input
                className="input"
                name="carId"
                value={form.carId}
                onChange={onChange}
                placeholder="e.g. 101"
              />

              <label>Date</label>
              <input
                type="date"
                className="input"
                name="date"
                value={form.date}
                onChange={onChange}
              />

              <label>Description</label>
              <input
                className="input"
                name="type"
                value={form.type}
                onChange={onChange}
                placeholder="Oil change"
              />

              <label>Service Center</label>
              <input
                className="input"
                name="serviceCenter"
                value={form.serviceCenter}
                onChange={onChange}
                placeholder="e.g. Toyota Paarden Eiland"
              />

              <label>Cost (R)</label>
              <input
                className="input"
                name="cost"
                value={form.cost}
                onChange={onChange}
                placeholder="1499.99"
              />

              <label>Notes</label>
              <input
                className="input"
                name="notes"
                value={form.notes}
                onChange={onChange}
                placeholder="Optional notes"
              />

              <label>Status</label>
              <select
                className="input"
                name="status"
                value={form.status}
                onChange={onChange}
              >
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In progress">In progress</option>
              </select>

              <div className="form-actions" style={{ marginTop: 16 }}>
                <button className="submit-btn" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{ marginLeft: 10 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
