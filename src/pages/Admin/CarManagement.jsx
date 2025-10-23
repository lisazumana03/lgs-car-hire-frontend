import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../scripts/adminApi';
import './AdminManagement.css';

function CarManagement() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingCar, setEditingCar] = useState(null);
    const [editForm, setEditForm] = useState({
        model: '',
        brand: '',
        year: '',
        rentalPrice: '',
        availability: true
    });

    const navigate = useNavigate();

    // Popular car brands for dropdown
    const carBrands = [
        "Toyota", "Honda", "BMW", "Mercedes-Benz", "Audi", "Volkswagen",
        "Ford", "Lamborghini", "Nissan", "Hyundai", "Mazda", "Kia",
        "Tesla", "Porsche", "Lexus", "Jeep", "Bentley", "Ferrari",
    ];

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        setLoading(true);
        setMessage('');
        try {
            const carsData = await adminApi.getAllCars();
            setCars(carsData || []);
        } catch (error) {
            setMessage('Error fetching cars: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCar = async (carId) => {
        try {
            setMessage('');

            // Check if car has active bookings
            const car = cars.find(c => c.carID === carId);
            if (car && (car.bookingID || !car.availability)) {
                setMessage('Cannot delete car: Car has active bookings or is currently unavailable');
                setDeleteConfirm(null);
                return;
            }

            await adminApi.deleteCar(carId);
            setMessage('Car deleted successfully!');
            setDeleteConfirm(null);
            fetchCars();
        } catch (error) {
            setMessage('Error deleting car: ' + error.message);
            setDeleteConfirm(null);
        }
    };

    const handleToggleAvailability = async (carId, currentAvailability) => {
        try {
            setMessage('');
            await adminApi.updateCarAvailability(carId, !currentAvailability);

            // Update local state
            setCars(cars.map(car =>
                car.carID === carId
                    ? { ...car, availability: !currentAvailability }
                    : car
            ));

            setMessage(`Car availability updated to ${!currentAvailability ? 'Available' : 'Unavailable'}`);
        } catch (error) {
            setMessage('Error updating car availability: ' + error.message);
        }
    };

    const handleEditClick = (car) => {
        setEditingCar(car);
        setEditForm({
            model: car.model || '',
            brand: car.brand || '',
            year: car.year || '',
            rentalPrice: car.rentalPrice || '',
            availability: car.availability || true
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleUpdateCar = async () => {
        try {
            setMessage('');
            const updatedCarData = {
                carID: editingCar.carID,
                model: editForm.model,
                brand: editForm.brand,
                year: parseInt(editForm.year),
                availability: editForm.availability,
                rentalPrice: parseFloat(editForm.rentalPrice),
                // Preserve existing data
                carTypeID: editingCar.carTypeID,
                carTypeName: editingCar.carTypeName,
                carTypeFuelType: editingCar.carTypeFuelType,
                carTypeNumberOfWheels: editingCar.carTypeNumberOfWheels,
                carTypeNumberOfSeats: editingCar.carTypeNumberOfSeats
            };

            await adminApi.updateCar(updatedCarData);
            setMessage('Car updated successfully!');
            setEditingCar(null);
            fetchCars();
        } catch (error) {
            setMessage('Error updating car: ' + error.message);
        }
    };

    // Get unique brands from cars
    const brands = [...new Set(cars.map(car => car.brand))];

    // Filter cars based on search and brand filter
    const filteredCars = cars.filter(car => {
        const matchesSearch =
            car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBrand = selectedBrand === "all" || car.brand === selectedBrand;
        const matchesStatus = filter === 'all' ||
            (filter === 'available' && car.availability) ||
            (filter === 'unavailable' && !car.availability);

        return matchesSearch && matchesBrand && matchesStatus;
    });

    if (loading) {
        return (
            <div className="admin-management">
                <div className="loading">Loading cars...</div>
            </div>
        );
    }

    return (
        <div className="admin-management">
            <div className="admin-header">
                <h1>Car Management</h1>
                <p>Manage vehicle inventory</p>
                <button
                    className="btn-add-car"
                    onClick={() => navigate('/register-car')}
                    style={{marginTop: '10px'}}
                >
                    + Add New Car
                </button>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="filters-container" style={{marginBottom: '20px'}}>
                <div className="filters-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: '15px',
                    alignItems: 'end'
                }}>
                    <div className="form-group">
                        <label>Search:</label>
                        <input
                            type="text"
                            placeholder="Search by brand or model..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Filter by Brand:</label>
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="filter-select"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        >
                            <option value="all">All Brands</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Filter by Status:</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        >
                            <option value="all">All Cars</option>
                            <option value="available">Available Only</option>
                            <option value="unavailable">Unavailable Only</option>
                        </select>
                    </div>

                    <div className="results-count" style={{
                        padding: '8px 12px',
                        background: '#f5f5f5',
                        borderRadius: '4px',
                        fontWeight: '500'
                    }}>
                        {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
                    </div>
                </div>
            </div>

            <div className="management-content">
                {filteredCars.length === 0 ? (
                    <div className="no-results">
                        <p className="no-results-text">No cars found</p>
                        <button
                            className="btn-add-car"
                            onClick={() => navigate('/register-car')}
                            style={{marginTop: '15px'}}
                        >
                            Add Your First Car
                        </button>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Year</th>
                                <th>Type</th>
                                <th>Price/Day</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCars.map(car => (
                                <tr key={car.carID}>
                                    <td>{car.carID}</td>
                                    <td>
                                        {car.imageData ? (
                                            <img
                                                src={`data:${car.imageType};base64,${car.imageData}`}
                                                alt={car.brand}
                                                className="car-thumbnail"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        ) : (
                                            <div className="car-placeholder" style={{
                                                width: '50px',
                                                height: '50px',
                                                background: '#f0f0f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '4px',
                                                fontSize: '20px'
                                            }}>
                                                🚗
                                            </div>
                                        )}
                                    </td>
                                    <td><strong>{car.brand}</strong></td>
                                    <td>{car.model}</td>
                                    <td>{car.year}</td>
                                    <td>{car.carTypeName || car.carType?.type || '-'}</td>
                                    <td>R{car.rentalPrice}</td>
                                    <td>
                                        <button
                                            className={`status-badge ${car.availability ? 'status-available' : 'status-unavailable'}`}
                                            onClick={() => handleToggleAvailability(car.carID, car.availability)}
                                            title="Click to toggle availability"
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {car.availability ? 'Available' : 'Unavailable'}
                                        </button>
                                    </td>
                                    <td className="actions">
                                        <div className="action-buttons" style={{
                                            display: 'flex',
                                            gap: '8px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEditClick(car)}
                                                title="Edit car"
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => setDeleteConfirm(car.carID)}
                                                title="Delete car"
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Car Modal */}
            {editingCar && (
                <div className="modal-overlay" onClick={() => setEditingCar(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Car - {editingCar.brand} {editingCar.model}</h3>

                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateCar(); }}>
                            <div className="form-row" style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px'
                            }}>
                                <div className="form-group">
                                    <label htmlFor="edit-brand">Brand *</label>
                                    <select
                                        id="edit-brand"
                                        name="brand"
                                        value={editForm.brand}
                                        onChange={handleEditFormChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <option value="">Select a brand</option>
                                        {carBrands.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="edit-model">Model *</label>
                                    <input
                                        type="text"
                                        id="edit-model"
                                        name="model"
                                        value={editForm.model}
                                        onChange={handleEditFormChange}
                                        placeholder="e.g., Corolla"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="form-row" style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px'
                            }}>
                                <div className="form-group">
                                    <label htmlFor="edit-year">Year *</label>
                                    <input
                                        type="number"
                                        id="edit-year"
                                        name="year"
                                        value={editForm.year}
                                        onChange={handleEditFormChange}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="edit-rentalPrice">Rental Price (R/day) *</label>
                                    <input
                                        type="number"
                                        id="edit-rentalPrice"
                                        name="rentalPrice"
                                        value={editForm.rentalPrice}
                                        onChange={handleEditFormChange}
                                        step="0.01"
                                        min="0"
                                        placeholder="e.g., 350"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="availability"
                                        checked={editForm.availability}
                                        onChange={handleEditFormChange}
                                        style={{ marginRight: '8px' }}
                                    />
                                    <span>Available for rent</span>
                                </label>
                            </div>

                            <div className="modal-actions" style={{
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'flex-end',
                                marginTop: '20px'
                            }}>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setEditingCar(null)}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-save"
                                    style={{
                                        padding: '8px 16px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this car? This action cannot be undone.</p>
                        <div className="modal-actions" style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-end',
                            marginTop: '20px'
                        }}>
                            <button
                                className="btn-cancel"
                                onClick={() => setDeleteConfirm(null)}
                                style={{
                                    padding: '8px 16px',
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-confirm-delete"
                                onClick={() => handleDeleteCar(deleteConfirm)}
                                style={{
                                    padding: '8px 16px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete Car
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarManagement;