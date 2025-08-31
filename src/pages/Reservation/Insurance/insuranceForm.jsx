/*
Sibulele Nohamba
220374686
Date: 28/08/2025
 */

import { useState } from "react";
import {
  createInsurance,
  readInsurance,
  updateInsurance,
  deleteInsurance,
  cancelInsurance,
} from "../../../services/insuranceService";

function InsuranceForm() {
  const [form, setForm] = useState({
    insuranceID: "",
    insuranceStartDate: "",
    insuranceCost: "",
    insuranceProvider: "",
    status: "",
    policyNumber: "",
    mechanic: "",
    carId: "",
  });
  const [message, setMessage] = useState("");

  const msg = (m) => {
    setMessage(m);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      await createInsurance(form);
      msg("Insurance created successfully");
      setForm({
        insuranceID: "",
        insuranceStartDate: "",
        insuranceCost: "",
        insuranceProvider: "",
        status: "",
        policyNumber: "",
        mechanic: "",
        carId: "",
      });
    } catch {
      msg("Insurance creation failed");
    }
  };

  const onRead = async () => {
    if (!form.insuranceID) return msg("Please enter the correct insurance ID to read");
    try {
      const { data } = await readInsurance(form.insuranceID);
      const date = data.insuranceStartDate ? String(data.insuranceStartDate).slice(0, 10) : "";
      setForm({
        insuranceID: data.insuranceID ?? "",
        insuranceStartDate: date,
        insuranceCost: data.insuranceCost ?? "",
        insuranceProvider: data.insuranceProvider ?? "",
        status: data.status ?? "",
        policyNumber: data.policyNumber ?? "",
        mechanic: data.mechanic ?? "",
        carId: data.carId ?? data.car?.carId ?? "",
      });
      msg("Read loaded");
    } catch {
      msg("Read failed");
    }
  };

  const onUpdate = async () => {
    try {
      await updateInsurance(form);
      msg("Insurance updated");
    } catch {
      msg("Insurance update failed");
    }
  };

  const onDelete = async () => {
    if (!form.insuranceID) return msg("Please enter insurance ID to delete");
    try {
      await deleteInsurance(form.insuranceID);
      msg("Insurance deleted");
    } catch {
      msg("Delete failed");
    }
  };

  const onCancel = async () => {
    if (!form.insuranceID) return msg("Please enter insurance ID to cancel");
    try {
      await cancelInsurance(form.insuranceID);
      msg("Insurance cancelled");
    } catch {
      msg("Insurance cancellation failed");
    }
  };

  return (
    <form onSubmit={onCreate}>
      <h2>Insurance</h2>

      <input name="insuranceID" value={form.insuranceID} onChange={handleChange} placeholder="Insurance ID" />
      <input type="date" name="insuranceStartDate" value={form.insuranceStartDate} onChange={handleChange} />
      <input type="number" name="insuranceCost" value={form.insuranceCost} onChange={handleChange} placeholder="Cost" />
      <input name="insuranceProvider" value={form.insuranceProvider} onChange={handleChange} placeholder="Provider" />
      <input name="status" value={form.status} onChange={handleChange} placeholder="Status" />
      <input type="number" name="policyNumber" value={form.policyNumber} onChange={handleChange} placeholder="Policy Number" />
      <input name="mechanic" value={form.mechanic} onChange={handleChange} placeholder="Mechanic" />
      <input type="number" name="carId" value={form.carId} onChange={handleChange} placeholder="Car ID" />

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button type="submit">Create</button>
        <button type="button" onClick={onRead}>Read</button>
        <button type="button" onClick={onUpdate}>Update</button>
        <button type="button" onClick={onDelete}>Delete</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>

      {message && <p>{message}</p>}
    </form>
  );
}

export default InsuranceForm;