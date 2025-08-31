/*
Sibulele Nohamba
220374686
Date: 25/08/2025
 */

import { useState } from "react";
import {
  createMaintenance,
  readMaintenance,
  updateMaintenance,
  deleteMaintenance,
  cancelMaintenance,
} from "../../services/maintenanceService";

function MaintenanceForm() {
  const [form, setForm] = useState({
    maintenanceID: "",
    serviceDate: "", 
    description: "",
    cost: "",
    status: "",
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
      await createMaintenance(form);
      msg("Maintenance created successfully!");
      setForm({
        maintenanceID: "",
        serviceDate: "",
        description: "",
        cost: "",
        status: "",
        mechanic: "",
        carId: "",
      });
    } catch {
      msg("Maintenance creation failed");
    }
  };

  const onRead = async () => {
    if (!form.maintenanceID) return msg("Please enter the correct maintenance ID to read");
    try {
      const { data } = await readMaintenance(form.maintenanceID);
      const date = data.serviceDate ? String(data.serviceDate).slice(0, 10) : "";
      setForm({
        maintenanceID: data.maintenanceID ?? "",
        serviceDate: date,
        description: data.description ?? "",
        cost: data.cost ?? "",
        status: data.status ?? "",
        mechanic: data.mechanic ?? "",
        carId: data.carId ?? data.car?.carID ?? "",
      });
      msg("Read loaded");
    } catch {
      msg("Read failed");
    }
  };

  const onUpdate = async () => {
    try {
      await updateMaintenance(form);
      msg("Maintenance updated");
    } catch {
      msg("Maintenance update failed");
    }
  };

  const onDelete = async () => {
    if (!form.maintenanceID) return msg("Please enter maintenance ID to delete");
    try {
      await deleteMaintenance(form.maintenanceID);
      msg("Maintenance deleted");
    } catch {
      msg("Delete failed");
    }
  };

  const onCancel = async () => {
    if (!form.maintenanceID) return msg("Please enter maintenance ID to cancel");
    try {
      await cancelMaintenance(form.maintenanceID);
      msg("Maintenance cancelled");
    } catch {
      msg("Maintenance cancellation failed");
    }
  };

  return (
    <form onSubmit={onCreate}>
      <h2>Maintenance</h2>

      <input name="maintenanceID" value={form.maintenanceID} onChange={handleChange} placeholder="Maintenance ID" />

      <input type="date" name="serviceDate" value={form.serviceDate} onChange={handleChange} />

      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />

      <input type="number" name="cost" value={form.cost} onChange={handleChange} placeholder="Cost" />

      <input name="status" value={form.status} onChange={handleChange} placeholder="Status" />

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

export default MaintenanceForm;