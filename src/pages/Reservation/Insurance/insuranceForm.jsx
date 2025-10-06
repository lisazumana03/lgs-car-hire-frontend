/*
Sibulele Nohamba
220374686
Date: 28/08/2025
 */

import { useState, useEffect } from "react";
import {
  createInsurance,
  readInsurance,
  updateInsurance,
  deleteInsurance,
  cancelInsurance,
} from "../../../services/insuranceService";

function InsuranceForm({ user }) {
  const [form, setForm] = useState({
    insuranceID: "",
    insuranceStartDate: "",
    insuranceCost: "",
    insuranceProvider: "",
    status: "",
    policyNumber: "",
    mechanic: "",
    carId: "",
    userId: user?.id || '',
    userName: user?.name || ''
  });
  const [message, setMessage] = useState("");

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        userId: user.id || '',
        userName: user.name || ''
      }));
    }
  }, [user]);

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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-8 border border-blue-300">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Insurance Management</h2>
        
        {/* User Information Display */}
        {user && (
          <div className="mb-6 p-4 bg-blue-900/50 border border-blue-500 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">User Information</h3>
            <div className="text-sm text-blue-200">
              <p><strong>Name:</strong> {user.name || 'Not available'}</p>
              <p><strong>User ID:</strong> {user.id || 'Not available'}</p>
              <p><strong>Email:</strong> {user.email || 'Not available'}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={onCreate} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              name="insuranceID" 
              value={form.insuranceID} 
              onChange={handleChange} 
              placeholder="Insurance ID" 
              className="w-full border border-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 bg-white/80 text-gray-900"
            />
            <input 
              type="date" 
              name="insuranceStartDate" 
              value={form.insuranceStartDate} 
              onChange={handleChange} 
              className="w-full border border-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 bg-white/80 text-gray-900"
            />
            <input 
              type="number" 
              name="insuranceCost" 
              value={form.insuranceCost} 
              onChange={handleChange} 
              placeholder="Cost" 
              className="w-full border border-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 bg-white/80 text-gray-900"
            />
            <input 
              name="insuranceProvider" 
              value={form.insuranceProvider} 
              onChange={handleChange} 
              placeholder="Provider" 
              className="w-full border border-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 bg-white/80 text-gray-900"
            />
            <input 
              name="status" 
              value={form.status} 
              onChange={handleChange} 
              placeholder="Status" 
              className="w-full border border-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 bg-white/80 text-gray-900"
            />
            <input 
              type="number" 
              name="policyNumber" 
              value={form.policyNumber} 
              onChange={handleChange} 
              placeholder="Policy Number" 
              className="w-full border border-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 bg-white/80 text-gray-900"
            />
            <input 
              name="mechanic" 
              value={form.mechanic} 
              onChange={handleChange} 
              placeholder="Mechanic" 
              className="w-full border border-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 bg-white/80 text-gray-900"
            />
            <input 
              type="number" 
              name="carId" 
              value={form.carId} 
              onChange={handleChange} 
              placeholder="Car ID" 
              className="w-full border border-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 bg-white/80 text-gray-900"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <button 
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-800 transition-all duration-300 font-bold"
            >
              Create
            </button>
            <button 
              type="button" 
              onClick={onRead}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-bold"
            >
              Read
            </button>
            <button 
              type="button" 
              onClick={onUpdate}
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-yellow-600 hover:to-yellow-800 transition-all duration-300 font-bold"
            >
              Update
            </button>
            <button 
              type="button" 
              onClick={onDelete}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-red-600 hover:to-red-800 transition-all duration-300 font-bold"
            >
              Delete
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-gray-600 hover:to-gray-800 transition-all duration-300 font-bold"
            >
              Cancel
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-4 rounded-xl text-center font-semibold ${
              message.includes('successfully') || message.includes('loaded') || message.includes('updated') || message.includes('deleted') || message.includes('cancelled')
                ? 'bg-green-900/50 text-green-300 border border-green-500'
                : 'bg-red-900/50 text-red-300 border border-red-500'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default InsuranceForm;