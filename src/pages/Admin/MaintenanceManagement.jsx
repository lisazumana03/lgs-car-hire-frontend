import React, { useState, useEffect } from 'react';
import { adminApi } from '../../scripts/adminApi';
import './AdminManagement.css';

function MaintenanceManagement() {
    const [maintenances, setMaintenances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [cars, setCars] = useState([]);
    const [formData, setFormData] = useState({
        maintenanceDate: '',
        description: '',
        cost: '',
        mechanicName: '',
        carId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log('🔍 Fetching maintenance data...');
            const [maintenancesData, carsData] = await Promise.all([
                adminApi.getAllMaintenance(),
                adminApi.getAllCars()
            ]);
            console.log('✅ Maintenance data:', maintenancesData);
            console.log('✅ Cars data:', carsData);
            setMaintenances(maintenancesData);
            setCars(carsData);
        } catch (error) {
            console.error('❌ Error fetching data:', error);
            setMessage('Error fetching data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateMaintenance = async (e) => {
        e.preventDefault();
        try {
            setMessage('');
            // Format data to match MaintenanceDTO
            const maintenanceData = {
                maintenanceDate: formData.maintenanceDate,
                description: formData.description,
                cost: parseFloat(formData.cost) || 0,
                mechanicName: formData.mechanicName,
                carId: parseInt(formData.carId) || 0
            };

            console.log('🚀 Creating maintenance with data:', maintenanceData);
            const result = await adminApi.createMaintenance(maintenanceData);
            console.log('✅ Create maintenance result:', result);

            setMessage('Maintenance record created successfully!');
            setShowForm(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('❌ Create maintenance error:', error);
            setMessage('Error creating maintenance: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            maintenanceDate: '',
            description: '',
            cost: '',
            mechanicName: '',
            carId: ''
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        resetForm();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-ZA');
    };

    if (loading) {
        return <div className="loading">Loading maintenance records...</div>;
    }

    return (
        <div className="admin-management">
            <div className="admin-header">
                <h1>Maintenance Management</h1>
                <p>Manage vehicle maintenance records</p>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="management-actions">
                <button
                    className="btn-add"
                    onClick={() => setShowForm(true)}
                >
                    + Add Maintenance Record
                </button>
            </div>

            {/* Maintenance Form Modal */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add Maintenance Record</h3>
                        <form onSubmit={handleCreateMaintenance}>
                            <div className="form-group">
                                <label>Car *</label>
                                <select
                                    name="carId"
                                    value={formData.carId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select a car</option>
                                    {cars.map(car => (
                                        <option key={car.carID} value={car.carID}>
                                            {car.brand} {car.model} ({car.carID})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Maintenance Date *</label>
                                <input
                                    type="date"
                                    name="maintenanceDate"
                                    value={formData.maintenanceDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Describe the maintenance work..."
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Cost (R) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mechanic Name</label>
                                    <input
                                        type="text"
                                        name="mechanicName"
                                        value={formData.mechanicName}
                                        onChange={handleInputChange}
                                        placeholder="Mechanic's name"
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={handleCancel} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Create Maintenance Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="management-content">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Car</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Cost</th>
                            <th>Mechanic</th>
                            {/* Removed Actions column */}
                        </tr>
                        </thead>
                        <tbody>
                        {maintenances.map(maintenance => (
                            <tr key={maintenance.maintenanceID}>
                                <td>{maintenance.maintenanceID}</td>
                                <td>
                                    {maintenance.car ?
                                        `${maintenance.car.brand} ${maintenance.car.model}` :
                                        `Car ID: ${maintenance.carId || 'N/A'}`}
                                </td>
                                <td>{formatDate(maintenance.maintenanceDate)}</td>
                                <td>{maintenance.description}</td>
                                <td>R{maintenance.cost?.toFixed(2) || '0.00'}</td>
                                <td>{maintenance.mechanicName || 'N/A'}</td>
                                {/* Removed Actions buttons */}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MaintenanceManagement;