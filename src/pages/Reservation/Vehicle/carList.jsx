/*
Car List View
*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCars, deleteCar } from "../../../services/carService";

function CarList() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterAvailable, setFilterAvailable] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await getAllCars();
            setCars(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load cars");
            setLoading(false);
            setCars([]);
        }
    };
    
    const filteredCars = cars.filter(car => {
        const matchesSearch = 
            car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.carType?.type?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAvailability = !filterAvailable || car.availability;
        return matchesSearch && matchesAvailability;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">Loading cars...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold mb-4 md:mb-0">Available Cars</h2>
                        
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Search by brand, model, or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border rounded-lg w-full md:w-64"
                            />
                            
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filterAvailable}
                                    onChange={(e) => setFilterAvailable(e.target.checked)}
                                    className="mr-2"
                                />
                                <span>Available Only</span>
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {filteredCars.length === 0 ? (
                        <p className="text-center text-gray-500">No cars found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-3 border text-left">Brand</th>
                                        <th className="px-4 py-3 border text-left">Model</th>
                                        <th className="px-4 py-3 border text-left">Year</th>
                                        <th className="px-4 py-3 border text-left">Type</th>
                                        <th className="px-4 py-3 border text-left">Fuel Type</th>
                                        <th className="px-4 py-3 border text-left">Seats</th>
                                        <th className="px-4 py-3 border text-left">Price/Day</th>
                                        <th className="px-4 py-3 border text-left">Insurance</th>
                                        <th className="px-4 py-3 border text-left">Status</th>
                                        <th className="px-4 py-3 border text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCars.map(car => (
                                        <tr key={car.carID} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 border">{car.brand}</td>
                                            <td className="px-4 py-3 border">{car.model}</td>
                                            <td className="px-4 py-3 border">{car.year}</td>
                                            <td className="px-4 py-3 border">{car.carType?.type || 'N/A'}</td>
                                            <td className="px-4 py-3 border">{car.carType?.fuelType || 'N/A'}</td>
                                            <td className="px-4 py-3 border">{car.carType?.numberOfSeats || 'N/A'}</td>
                                            <td className="px-4 py-3 border">${car.rentalPrice}</td>
                                            <td className="px-4 py-3 border">
                                                {car.insurance ? (
                                                    <span className="text-green-600">✓ Yes</span>
                                                ) : (
                                                    <span className="text-red-600">✗ No</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 border">
                                                {car.availability ? (
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                                        Rented
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 border">
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                                        onClick={() => alert('Edit functionality to be implemented')}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                                        onClick={() => handleDelete(car.carID)}
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

                <div className="flex justify-center gap-4">
                    <button 
                        type="button" 
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700" 
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CarList;