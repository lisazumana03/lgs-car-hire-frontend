import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMaintenance, createMaintenance, deleteMaintenance } from '../../../services/maintenanceService';
import './MaintenancePage.css';

export default function MaintenancePage() {
  const navigate = useNavigate();
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    carId: '',
    maintenanceDate: '',
    description: '',
    cost: '',
    mechanicName: ''
  });

  // Fetch real data from backend
  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllMaintenance();
      console.log('Maintenance records:', response.data);
      setMaintenanceRecords(response.data || []);
    } catch (err) {
      console.error('Error fetching maintenance records:', err);
      setError('Failed to load maintenance records. Please try again.');
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
      // Create payload matching backend MaintenanceDTO
      const maintenanceData = {
        carId: parseInt(formData.carId) || null,
        maintenanceDate: formData.maintenanceDate,
        description: formData.description,
        cost: parseFloat(formData.cost) || 0,
        mechanicName: formData.mechanicName || ''
      };
      
      console.log('Creating maintenance record:', maintenanceData);
      const response = await createMaintenance(maintenanceData);
      console.log('Maintenance created:', response.data);
      
      // Refresh the list
      await fetchMaintenanceRecords();
      
      // Reset form
      setFormData({
        carId: '',
        maintenanceDate: '',
        description: '',
        cost: '',
        mechanicName: ''
      });
      setShowForm(false);
      alert('Maintenance record created successfully!');
    } catch (err) {
      console.error('Error creating maintenance record:', err);
      setError(err.response?.data?.message || 'Failed to create maintenance record. Please try again.');
    }
  };

  const handleViewDetails = (record) => {
    // Navigate to detailed view or show modal
    console.log('View details for:', record);
  };

  if (loading) {
    return (
      <div className="maintenance-page">
        <div className="maintenance-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading maintenance records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="maintenance-page">
      <div className="maintenance-container">
        {/* Header */}
        <div className="maintenance-header">
          <h1 className="maintenance-title">Vehicle Maintenance</h1>
          <p className="maintenance-subtitle">Manage and track vehicle service records</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <p> {error}</p>
            <button onClick={() => setError('')} className="btn-close">×</button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="maintenance-actions">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '× Cancel' : '+ Add New Maintenance'}
          </button>
          <button 
            onClick={() => navigate('/maintenance-list')}
            className="btn btn-secondary"
          >
            View All Records
          </button>
        </div>

        {/* Add New Maintenance Form */}
        {showForm && (
          <div className="maintenance-card form-card">
            <h3 className="card-title">Add New Maintenance Record</h3>
            <form onSubmit={handleSubmit} className="maintenance-form">
              <div className="form-group">
                <label htmlFor="carId">Vehicle/Car ID</label>
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
                <label htmlFor="maintenanceDate">Maintenance Date</label>
                <input
                  type="date"
                  id="maintenanceDate"
                  name="maintenanceDate"
                  value={formData.maintenanceDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Service Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the maintenance work performed..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cost">Cost (R)</label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mechanicName">Mechanic Name</label>
                  <input
                    type="text"
                    id="mechanicName"
                    name="mechanicName"
                    value={formData.mechanicName}
                    onChange={handleChange}
                    placeholder="e.g., John Smith"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-submit">
                Save Maintenance Record
              </button>
            </form>
          </div>
        )}

        {/* Existing Maintenance Records */}
        <div className="records-section">
          <h2 className="section-title">Recent Maintenance Records</h2>
          
          {maintenanceRecords.length === 0 ? (
            <div className="empty-state">
              <p>No maintenance records found</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                Add Your First Record
              </button>
            </div>
          ) : (
            <div className="records-grid">
              {maintenanceRecords.map((record) => (
                <div key={record.maintenanceID} className="maintenance-card">
                  <div className="card-header">
                    <h3 className="vehicle-id">
                      Vehicle ID: {record.carId || 'N/A'}
                    </h3>
                  </div>

                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Maintenance Date</span>
                      <span className="value">
                        {record.maintenanceDate ? new Date(record.maintenanceDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Description</span>
                      <p className="description">{record.description || 'No description provided'}</p>
                    </div>

                    <div className="info-row">
                      <span className="label">Cost</span>
                      <span className="value cost">R {record.cost?.toFixed(2) || '0.00'}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">Mechanic</span>
                      <span className="value">{record.mechanicName || 'N/A'}</span>
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

