import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllCars,
    deleteCar,
    updateCarAvailability,
    deleteCarImage,
    updateCar,
    uploadCarImage
} from "../../services/carService.js";
import "./ManageCars.css";

function ManageCars() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingCar, setEditingCar] = useState(null);
    const [editForm, setEditForm] = useState({
        model: "",
        brand: "",
        year: "",
        rentalPrice: "",
        availability: true
    });
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    // Popular car brands
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
        setError("");
        try {
            const response = await getAllCars();
            setCars(response.data || []);
        } catch (err) {
            console.error("Error fetching cars:", err);
            setError("Unable to load cars. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (carId) => {
        try {
            setError("");
            setSuccess("");

            // Delete car image first
            try {
                await deleteCarImage(carId);
            } catch (imgErr) {
                console.log("No image to delete or image delete failed");
            }

            // Delete the car
            await deleteCar(carId);

            setSuccess("Car deleted successfully!");
            setDeleteConfirm(null);

            // Refresh the list
            fetchCars();

            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete car. Please try again.");
            setDeleteConfirm(null);
        }
    };

    const handleToggleAvailability = async (carId, currentAvailability) => {
        try {
            setError("");
            await updateCarAvailability(carId, !currentAvailability);

            // Update local state
            setCars(cars.map(car =>
                car.carID === carId
                    ? { ...car, availability: !currentAvailability }
                    : car
            ));

            setSuccess(`Car availability updated to ${!currentAvailability ? 'Available' : 'Unavailable'}`);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update availability.");
        }
    };

    const handleEditClick = (car) => {
        setEditingCar(car);
        setEditForm({
            model: car.model,
            brand: car.brand,
            year: car.year,
            rentalPrice: car.rentalPrice,
            availability: car.availability
        });
        setEditImagePreview(car.imageUrl || null);
        setEditImageFile(null);
        setError("");
    };

    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                return;
            }

            setEditImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            // Update car details
            const updatedCarData = {
                carID: editingCar.carID,
                model: editForm.model,
                brand: editForm.brand,
                year: parseInt(editForm.year),
                availability: editForm.availability,
                rentalPrice: parseFloat(editForm.rentalPrice),
                // Preserve existing car type data
                carTypeID: editingCar.carTypeID,
                carTypeName: editingCar.carTypeName,
                carTypeFuelType: editingCar.carTypeFuelType,
                carTypeNumberOfWheels: editingCar.carTypeNumberOfWheels,
                carTypeNumberOfSeats: editingCar.carTypeNumberOfSeats,
                imageUrl: editingCar.imageUrl
            };

            await updateCar(updatedCarData);

            // Upload new image if provided
            if (editImageFile) {
                try {
                    await uploadCarImage(editingCar.carID, editImageFile);
                } catch (imgErr) {
                    console.error("Failed to upload image:", imgErr);
                    setError("Car updated but image upload failed.");
                }
            }

            setSuccess("Car updated successfully!");
            setEditingCar(null);
            fetchCars();

            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update car. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const brands = [...new Set(cars.map(car => car.brand))];

    let filteredCars = cars.filter(car => {
        const matchesSearch =
            car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBrand = selectedBrand === "all" || car.brand === selectedBrand;

        return matchesSearch && matchesBrand;
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading cars...</p>
            </div>
        );
    }

    return (
        <div className="manage-cars-container">
            <div className="manage-cars-header">
                <h1>Manage Cars</h1>
                <button
                    className="btn-add-car"
                    onClick={() => navigate('/register-car')}
                >
                    + Add New Car
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="filters-container">
                <div className="filters-grid">
                    <input
                        type="text"
                        placeholder="Search by brand or model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Brands</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>

                    <div className="results-count">
                        {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
                    </div>
                </div>
            </div>

            {/* Cars Table */}
            {filteredCars.length === 0 ? (
                <div className="no-results">
                    <p className="no-results-text">No cars found</p>
                    <button
                        className="btn-add-car"
                        onClick={() => navigate('/register-car')}
                        style={{ marginTop: '15px' }}
                    >
                        Add Your First Car
                    </button>
                </div>
            ) : (
                <div className="cars-table-container">
                    <table className="cars-table">
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
                                        <div className="car-image-cell">
                                            {car.imageUrl ? (
                                                <img
                                                    src={car.imageUrl}
                                                    alt={`${car.brand} ${car.model}`}
                                                    className="car-thumbnail"
                                                />
                                            ) : (
                                                <div className="car-placeholder">
                                                    <svg fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td><strong>{car.brand}</strong></td>
                                    <td>{car.model}</td>
                                    <td>{car.year}</td>
                                    <td>{car.carTypeName || '-'}</td>
                                    <td>R{car.rentalPrice}</td>
                                    <td>
                                        <button
                                            className={`status-badge ${car.availability ? 'available' : 'unavailable'}`}
                                            onClick={() => handleToggleAvailability(car.carID, car.availability)}
                                            title="Click to toggle availability"
                                        >
                                            {car.availability ? 'Available' : 'Unavailable'}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEditClick(car)}
                                                title="Edit car"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => setDeleteConfirm(car.carID)}
                                                title="Delete car"
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

            {/* Edit Car Modal */}
            {editingCar && (
                <div className="modal-overlay" onClick={() => setEditingCar(null)}>
                    <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Car - {editingCar.brand} {editingCar.model}</h3>

                        {error && (
                            <div className="alert alert-error" style={{ marginBottom: '15px' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEditSubmit} className="edit-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="edit-brand">Brand *</label>
                                    <select
                                        id="edit-brand"
                                        name="brand"
                                        value={editForm.brand}
                                        onChange={handleEditFormChange}
                                        className="form-input"
                                        required
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
                                        className="form-input"
                                        placeholder="e.g., Corolla"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="edit-year">Year *</label>
                                    <input
                                        type="number"
                                        id="edit-year"
                                        name="year"
                                        value={editForm.year}
                                        onChange={handleEditFormChange}
                                        className="form-input"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        required
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
                                        className="form-input"
                                        step="0.01"
                                        min="0"
                                        placeholder="e.g., 350"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-carImage">Update Car Image (Optional)</label>
                                <input
                                    type="file"
                                    id="edit-carImage"
                                    name="carImage"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                    className="form-input"
                                />
                                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                                    Maximum file size: 5MB
                                </small>
                                {editImagePreview && (
                                    <div style={{ marginTop: '10px' }}>
                                        <p style={{ marginBottom: '8px', fontWeight: '500' }}>Preview:</p>
                                        <img
                                            src={editImagePreview}
                                            alt="Car preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                borderRadius: '8px',
                                                border: '1px solid #ddd'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="availability"
                                        checked={editForm.availability}
                                        onChange={handleEditFormChange}
                                        className="form-checkbox"
                                    />
                                    <span>Available for rent</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setEditingCar(null)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-save"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this car? This action cannot be undone.</p>
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
                                Delete Car
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageCars;
