/*
Sibulele Nohamba
220374686
Date: 28/08/2025
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../Common/Header";
import Navigation from "../../Common/Navigation";
import Footer from "../../Common/Footer";

import "../../../assets/styling/Global.css";
import "../../../assets/styling/Dashboard.css";
import "../../../assets/styling/Sidebar.css";

import {
  getInsuranceById,
  createInsurance,
  updateInsurance,
} from "../../../services/insuranceService";

export default function InsuranceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    insuranceProvider: "",
    policyNumber: "",
    insuranceStartDate: "",
    insuranceCost: "",
    status: "Active",
    mechanic: "",
    car: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const response = await getInsuranceById(id);
        const d = response.data || response;
        setForm({
          insuranceProvider: d.insuranceProvider ?? "",
          policyNumber: d.policyNumber ?? "",
          insuranceStartDate: (d.insuranceStartDate ?? "").slice(0, 10),
          insuranceCost: d.insuranceCost?.toString?.() ?? "",
          status: d.status ?? "Active",
          mechanic: d.mechanic ?? "",
          car: d.car?.toString?.() ?? "",
        });
      } catch (e) {
        setErr(e.message || "Failed to load policy");
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
      insuranceProvider: form.insuranceProvider,
      policyNumber: form.policyNumber,
      insuranceStartDate: form.insuranceStartDate,
      insuranceCost: form.insuranceCost ? Number(form.insuranceCost) : 0,
      status: form.status || "Active",
      mechanic: form.mechanic,
      car: form.car ? Number(form.car) : null,
    };

    // Add insuranceID for edit mode
    if (isEdit) {
      payload.insuranceID = Number(id);
    }

    try {
      if (isEdit) await updateInsurance(id, payload);
      else await createInsurance(payload);
      navigate("/insurance");
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
          <h1>{isEdit ? "Edit Insurance" : "New Insurance"}</h1>

          <div className="quick-actions">
            {err ? <div className="notice error">{err}</div> : null}

            <form onSubmit={onSubmit} className="form-group">
              <label>Vehicle/Car ID *</label>
              <input
                className="input"
                name="car"
                type="number"
                value={form.car}
                onChange={onChange}
                placeholder="Enter Car ID"
                required
              />

              <label>Insurance Provider *</label>
              <input
                className="input"
                name="insuranceProvider"
                value={form.insuranceProvider}
                onChange={onChange}
                placeholder="ABC Insurance"
                required
              />

              <label>Policy Number *</label>
              <input
                className="input"
                name="policyNumber"
                value={form.policyNumber}
                onChange={onChange}
                placeholder="123-456-789"
                required
              />

              <label>Start Date *</label>
              <input
                type="date"
                className="input"
                name="insuranceStartDate"
                value={form.insuranceStartDate}
                onChange={onChange}
                required
              />

              <label>Insurance Cost (R) *</label>
              <input
                className="input"
                name="insuranceCost"
                type="number"
                step="0.01"
                value={form.insuranceCost}
                onChange={onChange}
                placeholder="899.00"
                required
              />

              <label>Status</label>
              <select
                className="input"
                name="status"
                value={form.status}
                onChange={onChange}
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <label>Mechanic</label>
              <input
                className="input"
                name="mechanic"
                value={form.mechanic}
                onChange={onChange}
                placeholder="Christian Horner"
              />

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
