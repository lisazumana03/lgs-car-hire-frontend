import React, { useState, useEffect } from 'react';
import { adminApi } from '../../scripts/adminApi';
import './AdminManagement.css';

function LocationManagement() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingLocation, setEditingLocation] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        locationName: '',
        streetName: '',
        streetNumber: '',
        cityOrTown: '',
        provinceOrState: '',
        country: '',
        postalCode: '',
        latitude: '',
        longitude: '',
        fullAddress: ''
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const locationsData = await adminApi.getAllLocations();
            setLocations(locationsData);
        } catch (error) {
            setMessage('Error fetching locations: ' + error.message);
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

    const handleCreateLocation = async (e) => {
        e.preventDefault();
        try {
            await adminApi.createLocation(formData);
            setMessage('Location created successfully!');
            setShowForm(false);
            setFormData({
                locationName: '',
                streetName: '',
                streetNumber: '',
                cityOrTown: '',
                provinceOrState: '',
                country: '',
                postalCode: '',
                latitude: '',
                longitude: '',
                fullAddress: ''
            });
            fetchLocations();
        } catch (error) {
            setMessage('Error creating location: ' + error.message);
        }
    };

    const handleEditLocation = (location) => {
        setEditingLocation(location);
        setFormData({
            locationName: location.locationName || '',
            streetName: location.streetName || '',
            streetNumber: location.streetNumber || '',
            cityOrTown: location.cityOrTown || '',
            provinceOrState: location.provinceOrState || '',
            country: location.country || '',
            postalCode: location.postalCode || '',
            latitude: location.latitude || '',
            longitude: location.longitude || '',
            fullAddress: location.fullAddress || ''
        });
        setShowForm(true);
    };

    const handleUpdateLocation = async (e) => {
        e.preventDefault();
        try {
            await adminApi.updateLocation(editingLocation.locationID, formData);
            setMessage('Location updated successfully!');
            setShowForm(false);
            setEditingLocation(null);
            setFormData({
                locationName: '',
                streetName: '',
                streetNumber: '',
                cityOrTown: '',
                provinceOrState: '',
                country: '',
                postalCode: '',
                latitude: '',
                longitude: '',
                fullAddress: ''
            });
            fetchLocations();
        } catch (error) {
            setMessage('Error updating location: ' + error.message);
        }
    };

    const handleDeleteLocation = async (locationId) => {
        if (window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) {
            try {
                await adminApi.deleteLocation(locationId);
                setMessage('Location deleted successfully!');
                fetchLocations();
                setDeleteConfirm(null);
            } catch (error) {
                // Show user-friendly error message for foreign key constraint
                if (error.message.includes('403')) {
                    setMessage('Cannot delete location. There are active bookings using this location.');
                } else if (error.message.includes('foreign key') || error.message.includes('constraint')) {
                    setMessage('Cannot delete location. There are active bookings using this location.');
                } else {
                    setMessage('Error deleting location: ' + error.message);
                }
                setDeleteConfirm(null);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingLocation(null);
        setFormData({
            locationName: '',
            streetName: '',
            streetNumber: '',
            cityOrTown: '',
            provinceOrState: '',
            country: '',
            postalCode: '',
            latitude: '',
            longitude: '',
            fullAddress: ''
        });
    };

    if (loading) {
        return <div className="loading">Loading locations...</div>;
    }

    return (
        <div className="admin-management">
            <div className="admin-header">
                <h1>Location Management</h1>
                <p>Manage pickup and drop-off locations</p>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') || message.includes('Cannot') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="management-actions">
                <button
                    className="btn-add"
                    onClick={() => setShowForm(true)}
                >
                    + Add New Location
                </button>
            </div>

            {/* Location Form Modal */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingLocation ? 'Edit Location' : 'Add New Location'}</h3>
                        <form onSubmit={editingLocation ? handleUpdateLocation : handleCreateLocation}>
                            <div className="form-group">
                                <label>Location Name *</label>
                                <input
                                    type="text"
                                    name="locationName"
                                    value={formData.locationName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Street Name</label>
                                    <input
                                        type="text"
                                        name="streetName"
                                        value={formData.streetName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Street Number</label>
                                    <input
                                        type="text"
                                        name="streetNumber"
                                        value={formData.streetNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City/Town *</label>
                                    <input
                                        type="text"
                                        name="cityOrTown"
                                        value={formData.cityOrTown}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Province/State</label>
                                    <input
                                        type="text"
                                        name="provinceOrState"
                                        value={formData.provinceOrState}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Full Address</label>
                                <textarea
                                    name="fullAddress"
                                    value={formData.fullAddress}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={handleCancel} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    {editingLocation ? 'Update Location' : 'Create Location'}
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
                            <th>Location Name</th>
                            <th>City/Town</th>
                            <th>Country</th>
                            <th>Full Address</th>
                            <th>Postal Code</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {locations.map(location => (
                            <tr key={location.locationID}>
                                <td>{location.locationID}</td>
                                <td>
                                    <strong>{location.locationName}</strong>
                                </td>
                                <td>{location.cityOrTown}</td>
                                <td>{location.country}</td>
                                <td>
                                    {location.fullAddress ||
                                        `${location.streetNumber} ${location.streetName}, ${location.cityOrTown}`}
                                </td>
                                <td>{location.postalCode || 'N/A'}</td>
                                <td className="actions">
                                    <button
                                        onClick={() => handleEditLocation(location)}
                                        className="btn-edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(location.locationID)}
                                        className="btn-delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this location? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-confirm-delete"
                                onClick={() => handleDeleteLocation(deleteConfirm)}
                            >
                                Delete Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LocationManagement;