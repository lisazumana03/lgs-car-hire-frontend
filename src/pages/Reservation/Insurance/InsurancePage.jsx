/*
Sibulele Nohamba
220374686
Date: 28/08/2025
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllInsurance, createInsurance, deleteInsurance } from '../../../services/insuranceService';
import './InsurancePage.css';

export default function InsurancePage() {
  const navigate = useNavigate();
  const [insuranceRecords, setInsuranceRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    insuranceProvider: '',
    policyNumber: '',
    car: '',
    insuranceStartDate: '',
    insuranceCost: '',
    status: 'Active',
    mechanic: ''
  });

  // Fetch real data from backend
  useEffect(() => {
    fetchInsuranceRecords();
  }, []);

  const fetchInsuranceRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllInsurance();
      console.log('Insurance records:', response.data);
      setInsuranceRecords(response.data || []);
    } catch (err) {
      console.error('Error fetching insurance records:', err);
      setError('Failed to load insurance records. Please try again.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      // Create payload matching backend InsuranceDTO
      const insuranceData = {
        car: parseInt(formData.car) || null,
        insuranceProvider: formData.insuranceProvider,
        policyNumber: formData.policyNumber,
        insuranceStartDate: formData.insuranceStartDate,
        insuranceCost: parseFloat(formData.insuranceCost) || 0,
        status: formData.status,
        mechanic: formData.mechanic || ''
      };
      
      console.log('Creating insurance record:', insuranceData);
      const response = await createInsurance(insuranceData);
      console.log('Insurance created:', response.data);
      
      // Refresh the list
      await fetchInsuranceRecords();
      
      // Reset form
      setFormData({
        insuranceProvider: '',
        policyNumber: '',
        car: '',
        insuranceStartDate: '',
        insuranceCost: '',
        status: 'Active',
        mechanic: ''
      });
      setShowForm(false);
      alert('Insurance policy created successfully!');
    } catch (err) {
      console.error('Error creating insurance record:', err);
      setError(err.response?.data?.message || 'Failed to create insurance policy. Please try again.');
    }
  };

  const handleViewDetails = (record) => {
    // Navigate to detailed view or show modal
    console.log('View details for:', record);
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

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <button onClick={() => setError('')} className="btn-close">×</button>
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
          <button 
            onClick={() => navigate('/insurance-list')}
            className="btn btn-secondary"
          >
            View All Policies
          </button>
        </div>

        {/* Add New Insurance Form */}
        {showForm && (
          <div className="insurance-card form-card">
            <h3 className="card-title">Add New Insurance Policy</h3>
            <form onSubmit={handleSubmit} className="insurance-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="insuranceProvider">Insurance Provider</label>
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
                  <label htmlFor="policyNumber">Policy Number</label>
                  <input
                    type="text"
                    id="policyNumber"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    placeholder="e.g., 123-456-789"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="car">Vehicle/Car ID</label>
                  <input
                    type="number"
                    id="car"
                    name="car"
                    value={formData.car}
                    onChange={handleChange}
                    placeholder="e.g., 1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="insuranceStartDate">Start Date</label>
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
                  <label htmlFor="insuranceCost">Insurance Cost (R)</label>
                  <input
                    type="number"
                    id="insuranceCost"
                    name="insuranceCost"
                    value={formData.insuranceCost}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
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

              <button type="submit" className="btn btn-submit">
                Save Insurance Policy
              </button>
            </form>
          </div>
        )}

        {/* Existing Insurance Records */}
        <div className="records-section">
          <h2 className="section-title">Active Insurance Policies</h2>
          
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
                      <span className="label">Vehicle ID</span>
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
                      onClick={() => handleViewDetails(record)}
                      className="btn btn-view"
                    >
                      View Details
                    </button>
                    <button className="btn btn-edit">
                      Edit
                    </button>
                    <button className="btn btn-renew">
                      Renew
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

