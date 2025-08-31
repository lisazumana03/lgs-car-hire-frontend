import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCars, getAvailableCars } from "../../../services/carService.js";

/*
Imtiyaaz Waggie 219374759
Updated to support imageUrl from backend
*/

function CarCard({ car, onBook }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            {/* Car Image */}
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                {car.imageUrl && !imageError ? (
                    <img 
                        src={car.imageUrl} 
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                )}
            </div>

            {/* Car Details */}
            <div className="p-5">
                {/* Header */}
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                        {car.brand} {car.model}
                    </h3>
                    <div className="flex items-center gap-3">
                        <p className="text-gray-500">{car.year}</p>
                        <span className="text-gray-400">•</span>
                        <p className="text-gray-500 text-sm">ID: {car.carID}</p>
                    </div>
                </div>

                {/* Specifications */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {car.carTypeName || 'Standard'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        {car.carTypeFuelType || 'Petrol'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {car.carTypeNumberOfSeats || '5'} Seats
                    </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-4">
                    {car.insuranceID && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Insurance Included
                        </span>
                    )}
                    {car.availability ? (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Available
                        </span>
                    ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            Rented
                        </span>
                    )}
                </div>

                {/* Price and Book Button */}
                <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                        <p className="text-2xl font-bold text-red-600">
                            R{car.rentalPrice}
                        </p>
                        <p className="text-xs text-gray-500">per day</p>
                    </div>
                    <button
                        onClick={() => onBook(car.carID)}
                        disabled={!car.availability}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                            car.availability
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {car.availability ? 'Book Now' : 'Not Available'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function CarView() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
    const [selectedType, setSelectedType] = useState("all");
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [priceSort, setPriceSort] = useState("none");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCars();
    }, [showOnlyAvailable]);

    const fetchCars = async () => {
        setLoading(true);
        setError("");
        try {
            const response = showOnlyAvailable
                ? await getAvailableCars()
                : await getAllCars();
            setCars(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching cars:", err);
            setError("Unable to load cars. Please try again later.");
            setLoading(false);
            setCars([]);
        }
    };

    const brands = [...new Set(cars.map(car => car.brand))];
    const types = [...new Set(cars.map(car => car.carTypeName).filter(Boolean))];

    let filteredCars = cars.filter(car => {
        const matchesSearch =
            car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBrand = selectedBrand === "all" || car.brand === selectedBrand;
        const matchesType = selectedType === "all" || car.carTypeName === selectedType;

        return matchesSearch && matchesBrand && matchesType;
    });

    if (priceSort === "low-high") {
        filteredCars.sort((a, b) => a.rentalPrice - b.rentalPrice);
    } else if (priceSort === "high-low") {
        filteredCars.sort((a, b) => b.rentalPrice - a.rentalPrice);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading cars...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Back Button and Search/Filter Section */}
                <div className="flex gap-4 mb-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/")}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition h-fit"
                    >
                        Back to Home
                    </button>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search Bar */}
                            <div className="lg:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Search by brand or model..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:border-red-500"
                                />
                            </div>

                            {/* Brand Filter */}
                            <div>
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:border-red-500"
                                >
                                    <option value="all">All Brands</option>
                                    {brands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Type Filter */}
                            <div>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:border-red-500"
                                >
                                    <option value="all">All Types</option>
                                    {types.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Sort */}
                            <div>
                                <select
                                    value={priceSort}
                                    onChange={(e) => setPriceSort(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:border-red-500"
                                >
                                    <option value="none">Sort by Price</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Available Only Toggle */}
                        <div className="mt-4 flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showOnlyAvailable}
                                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                    className="mr-2 h-4 w-4 text-red-600"
                                />
                                <span className="text-black">Show available cars only</span>
                            </label>
                            <span className="ml-auto text-black">
                                {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cars Grid */}
                {filteredCars.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-500 text-lg">No cars found matching your criteria</p>
                        <p className="text-gray-400 mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCars.map(car => (
                            <CarCard 
                                key={car.carID} 
                                car={car} 
                                onBook={(carId) => navigate(`/make-booking?carId=${carId}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CarView;