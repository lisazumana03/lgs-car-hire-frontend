/*
Sibulele Nohamba
220374686
Date: 31/08/2025
 */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../../components/common/Header/Header";
import Navigation from "../../../components/common/Header/Navigation";
import Footer from "../../../components/common/Footer/Footer";

import "../../../assets/styling/Global.css";
import "../../../assets/styling/Dashboard.css";
import "../../../assets/styling/Sidebar.css";

import {
  getInsuranceById,
  createInsurance,
  updateInsurance,
} from "../../../services/insurance.service";

export default function InsuranceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    providerName: "",
    policyNumber: "",
    startDate: "",
    endDate: "",
    premium: "",
    brokerName: "",
    brokerPhone: "",
    brokerEmail: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const d = await getInsuranceById(id);
        setForm({
          providerName: d.providerName ?? d.company ?? "",
          policyNumber: d.policyNumber ?? "",
          startDate: (d.startDate ?? "").slice(0, 10),
          endDate: (d.endDate ?? "").slice(0, 10),
          premium: d.premium?.toString?.() ?? "",
          brokerName: d.brokerName ?? d.insuranceBroker ?? "",
          brokerPhone: d.brokerPhone ?? "",
          brokerEmail: d.brokerEmail ?? "",
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
      ...form,
      premium: form.premium ? Number(form.premium) : 0,
    };

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
              <label>Provider</label>
              <input
                className="input"
                name="providerName"
                value={form.providerName}
                onChange={onChange}
                placeholder="ABC Insurance"
              />

              <label>Policy Number</label>
              <input
                className="input"
                name="policyNumber"
                value={form.policyNumber}
                onChange={onChange}
                placeholder="123-456-789"
              />

              <label>Start Date</label>
              <input
                type="date"
                className="input"
                name="startDate"
                value={form.startDate}
                onChange={onChange}
              />

              <label>End Date</label>
              <input
                type="date"
                className="input"
                name="endDate"
                value={form.endDate}
                onChange={onChange}
              />

              <label>Premium (R)</label>
              <input
                className="input"
                name="premium"
                value={form.premium}
                onChange={onChange}
                placeholder="899.00"
              />

              <label>Broker Name</label>
              <input
                className="input"
                name="brokerName"
                value={form.brokerName}
                onChange={onChange}
                placeholder="Thabo M."
              />

              <label>Broker Phone</label>
              <input
                className="input"
                name="brokerPhone"
                value={form.brokerPhone}
                onChange={onChange}
                placeholder="+27 82 123 4567"
              />

              <label>Broker Email</label>
              <input
                className="input"
                name="brokerEmail"
                value={form.brokerEmail}
                onChange={onChange}
                placeholder="broker@example.com"
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
