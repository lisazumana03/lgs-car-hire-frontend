import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllInsurance, createInsurance, updateInsurance, deleteInsurance } from '../../../services/insuranceService';
import './InsurancePage.css';

export default function InsurancePage() {
  const navigate = useNavigate();
  const [insuranceRecords, setInsuranceRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    insuranceProvider: '',
    policyNumber: '',
    carId: '',
    insuranceStartDate: '',
    insuranceCost: '',
    status: 'Active',
    mechanic: ''
  });

  // Fetch insurance data
  useEffect(() => {
    fetchInsuranceRecords();
  }, []);

  const fetchInsuranceRecords = async () => {
    try {
      setLoading(true);
      setMessage('');
      const response = await getAllInsurance();
      console.log('✅ Insurance records:', response.data);
      setInsuranceRecords(response.data || []);
    } catch (err) {
      console.error('❌ Error fetching insurance records:', err);
      setMessage('Failed to load insurance records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (record) => {
    setEditingInsurance(record);
    setFormData({
      insuranceProvider: record.insuranceProvider || '',
      policyNumber: record.policyNumber || '',
      carId: record.car || '', // Note: backend uses 'car' field
      insuranceStartDate: record.insuranceStartDate ? record.insuranceStartDate.split('T')[0] : '',
      insuranceCost: record.insuranceCost || '',
      status: record.status || 'Active',
      mechanic: record.mechanic || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage('');

      // Format data for backend
      const insuranceData = {
        insuranceProvider: formData.insuranceProvider,
        policyNumber: formData.policyNumber,
        car: parseInt(formData.carId) || null, // Backend expects 'car' field
        insuranceStartDate: formData.insuranceStartDate,
        insuranceCost: parseFloat(formData.insuranceCost) || 0,
        status: formData.status,
        mechanic: formData.mechanic || ''
      };

      console.log('📦 Insurance data to send:', insuranceData);

      if (editingInsurance) {
        // Update existing insurance
        await updateInsurance(editingInsurance.insuranceID, insuranceData);
        setMessage('✅ Insurance policy updated successfully!');
      } else {
        // Create new insurance
        await createInsurance(insuranceData);
        setMessage('✅ Insurance policy created successfully!');
      }

      // Refresh data and reset form
      await fetchInsuranceRecords();
      handleCancel();

    } catch (err) {
      console.error('❌ Error saving insurance:', err);
      setMessage('❌ Failed to save insurance policy: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (insuranceId) => {
    try {
      setMessage('');
      await deleteInsurance(insuranceId);
      setMessage('✅ Insurance policy deleted successfully!');
      setDeleteConfirm(null);
      fetchInsuranceRecords();
    } catch (err) {
      console.error('❌ Error deleting insurance:', err);
      setMessage('❌ Failed to delete insurance policy: ' + (err.response?.data?.message || err.message));
      setDeleteConfirm(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInsurance(null);
    setFormData({
      insuranceProvider: '',
      policyNumber: '',
      carId: '',
      insuranceStartDate: '',
      insuranceCost: '',
      status: 'Active',
      mechanic: ''
    });
  };

  if (loading) {
    return (
        <div className="insurance-page">
          <div className="insurance-container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading insurance policies...</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="insurance-page">
        <div className="insurance-container">
          {/* Header */}
          <div className="insurance-header">
            <h1 className="insurance-title">Vehicle Insurance</h1>
            <p className="insurance-subtitle">Manage insurance policies and coverage details</p>
          </div>

          {/* Message Display */}
          {message && (
              <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
                {message}
              </div>
          )}

          {/* Action Buttons */}
          <div className="insurance-actions">
            <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
            >
              {showForm ? '× Cancel' : '+ Add New Policy'}
            </button>
          </div>

          {/* Insurance Form */}
          {showForm && (
              <div className="insurance-card form-card">
                <h3 className="card-title">
                  {editingInsurance ? 'Edit Insurance Policy' : 'Add New Insurance Policy'}
                </h3>
                <form onSubmit={handleSubmit} className="insurance-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="insuranceProvider">Insurance Provider *</label>
                      <input
                          type="text"
                          id="insuranceProvider"
                          name="insuranceProvider"
                          value={formData.insuranceProvider}
                          onChange={handleChange}
                          placeholder="e.g., ABC Insurance"
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="policyNumber">Policy Number *</label>
                      <input
                          type="text"
                          id="policyNumber"
                          name="policyNumber"
                          value={formData.policyNumber}
                          onChange={handleChange}
                          placeholder="e.g., POL-123-456"
                          required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="carId">Car ID *</label>
                      <input
                          type="number"
                          id="carId"
                          name="carId"
                          value={formData.carId}
                          onChange={handleChange}
                          placeholder="e.g., 1"
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="insuranceStartDate">Start Date *</label>
                      <input
                          type="date"
                          id="insuranceStartDate"
                          name="insuranceStartDate"
                          value={formData.insuranceStartDate}
                          onChange={handleChange}
                          required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="insuranceCost">Insurance Cost (R) *</label>
                      <input
                          type="number"
                          id="insuranceCost"
                          name="insuranceCost"
                          value={formData.insuranceCost}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="status">Status *</label>
                      <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Expired">Expired</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mechanic">Mechanic Name (Optional)</label>
                    <input
                        type="text"
                        id="mechanic"
                        name="mechanic"
                        value={formData.mechanic}
                        onChange={handleChange}
                        placeholder="Enter mechanic name"
                    />
                  </div>

                  <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={handleCancel} className="btn btn-back">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-submit">
                      {editingInsurance ? 'Update Policy' : 'Create Policy'}
                    </button>
                  </div>
                </form>
              </div>
          )}

          {/* Insurance Records List */}
          <div className="records-section">
            <h2 className="section-title">
              Insurance Policies ({insuranceRecords.length})
            </h2>

            {insuranceRecords.length === 0 ? (
                <div className="empty-state">
                  <p>No insurance policies found</p>
                  <button onClick={() => setShowForm(true)} className="btn btn-primary">
                    Add Your First Policy
                  </button>
                </div>
            ) : (
                <div className="records-grid">
                  {insuranceRecords.map((record) => (
                      <div key={record.insuranceID} className="insurance-card">
                        <div className="card-header">
                          <h3 className="provider-name">{record.insuranceProvider || 'Unknown Provider'}</h3>
                          <span className={`status-badge status-${(record.status || 'pending').toLowerCase()}`}>
                      {record.status || 'Pending'}
                    </span>
                        </div>

                        <div className="card-content">
                          <div className="info-row">
                            <span className="label">Policy Number</span>
                            <span className="value policy-number">{record.policyNumber || 'N/A'}</span>
                          </div>

                          <div className="info-row">
                            <span className="label">Car ID</span>
                            <span className="value">{record.car || 'N/A'}</span>
                          </div>

                          <div className="info-row">
                            <span className="label">Start Date</span>
                            <span className="value">
                        {record.insuranceStartDate ? new Date(record.insuranceStartDate).toLocaleDateString() : 'N/A'}
                      </span>
                          </div>

                          <div className="info-row">
                            <span className="label">Insurance Cost</span>
                            <span className="value premium">R {record.insuranceCost?.toFixed(2) || '0.00'}</span>
                          </div>

                          <div className="info-row">
                            <span className="label">Mechanic</span>
                            <span className="value">{record.mechanic || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="card-actions">
                          <button
                              onClick={() => handleEdit(record)}
                              className="btn btn-edit"
                          >
                            Edit
                          </button>
                          <button
                              onClick={() => setDeleteConfirm(record.insuranceID)}
                              className="btn btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
              <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Confirm Delete</h3>
                  <p>Are you sure you want to delete this insurance policy? This action cannot be undone.</p>
                  <div className="modal-actions">
                    <button
                        className="btn-cancel"
                        onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </button>
                    <button
                        className="btn-confirm-delete"
                        onClick={() => handleDelete(deleteConfirm)}
                    >
                      Delete Policy
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Back Button */}
          <div className="back-section">
            <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-back"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
  );
}