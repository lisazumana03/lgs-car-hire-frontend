import { useState, useEffect } from "react";
import { create, updateCar, uploadCarImage } from "../../services/carService.js";
import { createCarType, getAllCarTypes } from "../../services/carTypeService.js";
import "./AdminCarForm.css";

function CarForm() {
    const [step, setStep] = useState(1); // 1 = Car Info, 2 = Car Type Info
    const [createdCarId, setCreatedCarId] = useState(null);
    const [existingCarTypes, setExistingCarTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Combined form data for both car and car type
    const [formData, setFormData] = useState({
        // Car fields
        model: "",
        brand: "",
        year: new Date().getFullYear(),
        availability: true,
        rentalPrice: "",

        // Car Type fields (for this specific car)
        createNewType: true,
        typeName: "",
        fuelType: "Petrol",
        numberOfWheels: 4,
        numberOfSeats: 5,

        // For linking existing type
        existingTypeId: null
    });

    // Popular car brands
    const carBrands = [
        "Toyota", "Honda", "BMW", "Mercedes-Benz", "Audi", "Volkswagen",
        "Ford", "Lamborghini", "Nissan", "Hyundai", "Mazda", "Kia",
        "Tesla", "Porsche", "Lexus", "Jeep", "Bentley", "Ferrari",
    ];

    // Car type templates
    const carTypeTemplates = [
        { name: "Economy", fuelType: "Petrol", seats: 5, wheels: 4 },
        { name: "Sedan", fuelType: "Petrol", seats: 5, wheels: 4 },
        { name: "SUV", fuelType: "Petrol", seats: 7, wheels: 4 },
        { name: "Luxury", fuelType: "Petrol", seats: 5, wheels: 4 },
        { name: "Sports", fuelType: "Petrol", seats: 2, wheels: 4 },
        { name: "Electric", fuelType: "Electric", seats: 5, wheels: 4 },
        { name: "Hybrid", fuelType: "Hybrid", seats: 5, wheels: 4 },
        { name: "Minivan", fuelType: "Petrol", seats: 8, wheels: 4 },
        { name: "Convertible", fuelType: "Petrol", seats: 2, wheels: 4 },
        { name: "Truck", fuelType: "Diesel", seats: 3, wheels: 6 }
    ];

    useEffect(() => {
        fetchExistingCarTypes();
    }, []);

    const fetchExistingCarTypes = async () => {
        try {
            const response = await getAllCarTypes();
            setExistingCarTypes(response.data);
        } catch (err) {
            console.error("Error fetching car types:", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                return;
            }

            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const applyTypeTemplate = (template) => {
        setFormData(prev => ({
            ...prev,
            typeName: template.name,
            fuelType: template.fuelType,
            numberOfSeats: template.seats,
            numberOfWheels: template.wheels
        }));
    };

    const validateCarInfo = () => {
        if (!formData.model.trim()) return "Model is required";
        if (!formData.brand.trim()) return "Brand is required";
        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            return "Please enter a valid year";
        }
        if (!formData.rentalPrice || formData.rentalPrice <= 0) {
            return "Please enter a valid rental price";
        }
        return null;
    };

    const validateCarTypeInfo = () => {
        if (formData.createNewType) {
            if (!formData.typeName.trim()) return "Type name is required";
            if (!formData.fuelType) return "Fuel type is required";
            if (formData.numberOfSeats < 1 || formData.numberOfSeats > 50) {
                return "Number of seats must be between 1 and 50";
            }
            if (formData.numberOfWheels < 2 || formData.numberOfWheels > 18) {
                return "Number of wheels must be between 2 and 18";
            }
        }
        return null;
    };

    const handleStep1Submit = async (e) => {
        e.preventDefault();

        const validationError = validateCarInfo();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Create the car first
            const carData = {
                model: formData.model,
                brand: formData.brand,
                year: parseInt(formData.year),
                availability: formData.availability,
                rentalPrice: parseFloat(formData.rentalPrice)
            };

            const carResponse = await create(carData);
            const createdCar = carResponse.data;
            setCreatedCarId(createdCar.carID);

            // Upload image if provided
            if (imageFile) {
                try {
                    await uploadCarImage(createdCar.carID, imageFile);
                } catch (imgErr) {
                    console.error("Failed to upload image:", imgErr);
                    setError("Car created but image upload failed. You can upload it later.");
                }
            }

            // Move to step 2
            setStep(2);
            if (!imageFile) {
                setError("");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create car. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStep2Submit = async (e) => {
        e.preventDefault();
        
        if (formData.createNewType) {
            const validationError = validateCarTypeInfo();
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setLoading(true);
        setError("");

        try {
            if (formData.createNewType) {
                // Create new car type and link it to the car
                const carTypeData = {
                    type: formData.typeName,
                    fuelType: formData.fuelType,
                    numberOfWheels: parseInt(formData.numberOfWheels),
                    numberOfSeats: parseInt(formData.numberOfSeats),
                    carID: createdCarId // Link to the created car
                };

                const typeResponse = await createCarType(carTypeData);
                const createdType = typeResponse.data;

                // Update the car with the car type reference
                const updatedCarData = {
                    carID: createdCarId,
                    model: formData.model,
                    brand: formData.brand,
                    year: parseInt(formData.year),
                    availability: formData.availability,
                    rentalPrice: parseFloat(formData.rentalPrice),
                    imageUrl: formData.imageUrl || null,
                    carTypeID: createdType.carTypeID,
                    carTypeName: createdType.type,
                    carTypeFuelType: createdType.fuelType,
                    carTypeNumberOfWheels: createdType.numberOfWheels,
                    carTypeNumberOfSeats: createdType.numberOfSeats
                };

                await updateCar(updatedCarData);
            }

            setSuccess(`Successfully added ${formData.brand} ${formData.model} with its type configuration!`);

            // Reset form
            setFormData({
                model: "",
                brand: "",
                year: new Date().getFullYear(),
                availability: true,
                rentalPrice: "",
                createNewType: true,
                typeName: "",
                fuelType: "Petrol",
                numberOfWheels: 4,
                numberOfSeats: 5,
                existingTypeId: null
            });
            setImageFile(null);
            setImagePreview(null);
            setStep(1);
            setCreatedCarId(null);

            // Refresh car types list
            fetchExistingCarTypes();

            setTimeout(() => setSuccess(""), 7000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create car type. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSkipType = async () => {
        // Skip creating type and just finish with the car
        setSuccess(`Successfully added ${formData.brand} ${formData.model} without type configuration!`);

        // Reset form
        setFormData({
            model: "",
            brand: "",
            year: new Date().getFullYear(),
            availability: true,
            rentalPrice: "",
            createNewType: true,
            typeName: "",
            fuelType: "Petrol",
            numberOfWheels: 4,
            numberOfSeats: 5,
            existingTypeId: null
        });
        setImageFile(null);
        setImagePreview(null);
        setStep(1);
        setCreatedCarId(null);

        setTimeout(() => setSuccess(""), 7000);
    };

    return (
        <div className="admin-form-container">
            <div className="admin-form-wrapper">
                <h2 className="admin-form-title">Add New Car & Type</h2>
                
                {/* Progress Indicator */}
                <div className="progress-indicator">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Car Information</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Type Configuration</span>
                    </div>
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

                {/* Step 1: Car Information */}
                {step === 1 && (
                    <form onSubmit={handleStep1Submit} className="admin-form">
                        <div className="form-section">
                            <h3 className="section-title">Step 1: Car Information</h3>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="brand">Brand *</label>
                                    <select
                                        id="brand"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select a brand</option>
                                        {carBrands.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="model">Model *</label>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Corolla"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="year">Year *</label>
                                    <input
                                        type="number"
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="rentalPrice">Rental Price (R/day) *</label>
                                    <input
                                        type="number"
                                        id="rentalPrice"
                                        name="rentalPrice"
                                        value={formData.rentalPrice}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 350"
                                        step="0.01"
                                        min="0"
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="carImage">Car Image (Optional)</label>
                                <input
                                    type="file"
                                    id="carImage"
                                    name="carImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="form-input"
                                />
                                <small style={{ color: '#666', fontSize: '0.875rem' }}>
                                    Maximum file size: 5MB. Accepted formats: JPG, PNG, GIF, WEBP
                                </small>
                                {imagePreview && (
                                    <div style={{ marginTop: '10px' }}>
                                        <p style={{ marginBottom: '8px', fontWeight: '500' }}>Preview:</p>
                                        <img
                                            src={imagePreview}
                                            alt="Car preview"
                                            style={{
                                                maxWidth: '300px',
                                                maxHeight: '200px',
                                                borderRadius: '8px',
                                                border: '1px solid #ddd'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="availability"
                                        checked={formData.availability}
                                        onChange={handleInputChange}
                                        className="form-checkbox"
                                    />
                                    <span>Available for rent immediately</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading ? 'Creating Car...' : 'Next: Configure Type'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        model: "",
                                        brand: "",
                                        year: new Date().getFullYear(),
                                        availability: true,
                                        rentalPrice: "",
                                        createNewType: true,
                                        typeName: "",
                                        fuelType: "Petrol",
                                        numberOfWheels: 4,
                                        numberOfSeats: 5,
                                        existingTypeId: null
                                    });
                                    setImageFile(null);
                                    setImagePreview(null);
                                }}
                                className="btn btn-secondary"
                            >
                                Clear Form
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: Car Type Configuration */}
                {step === 2 && (
                    <form onSubmit={handleStep2Submit} className="admin-form">
                        <div className="form-section">
                            <h3 className="section-title">Step 2: Configure Type for {formData.brand} {formData.model}</h3>
                            
                            {/* Quick Templates */}
                            <div className="template-section">
                                <p className="template-label">Quick Templates:</p>
                                <div className="template-grid">
                                    {carTypeTemplates.map((template, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => applyTypeTemplate(template)}
                                            className="template-button"
                                        >
                                            <span className="template-name">{template.name}</span>
                                            <span className="template-details">
                                                {template.fuelType} • {template.seats} seats
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="typeName">Type Name *</label>
                                    <input
                                        type="text"
                                        id="typeName"
                                        name="typeName"
                                        value={formData.typeName}
                                        onChange={handleInputChange}
                                        placeholder="e.g., SUV, Sedan, Sports"
                                        className="form-input"
                                        required={formData.createNewType}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="fuelType">Fuel Type *</label>
                                    <select
                                        id="fuelType"
                                        name="fuelType"
                                        value={formData.fuelType}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required={formData.createNewType}
                                    >
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="CNG">CNG</option>
                                        <option value="LPG">LPG</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="numberOfSeats">Number of Seats *</label>
                                    <input
                                        type="number"
                                        id="numberOfSeats"
                                        name="numberOfSeats"
                                        value={formData.numberOfSeats}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="50"
                                        className="form-input"
                                        required={formData.createNewType}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="numberOfWheels">Number of Wheels *</label>
                                    <input
                                        type="number"
                                        id="numberOfWheels"
                                        name="numberOfWheels"
                                        value={formData.numberOfWheels}
                                        onChange={handleInputChange}
                                        min="2"
                                        max="18"
                                        className="form-input"
                                        required={formData.createNewType}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading ? 'Creating Type...' : 'Complete Setup'}
                            </button>
                            <button
                                type="button"
                                onClick={handleSkipType}
                                className="btn btn-secondary"
                            >
                                Skip Type Configuration
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setError("");
                                }}
                                className="btn btn-secondary"
                            >
                                Back to Car Info
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default CarForm;