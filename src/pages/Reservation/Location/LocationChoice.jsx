/*
Location Choice Component
Allows users to choose between Map-based or List-based location selection
*/

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LocationChoice() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCar = location.state?.selectedCar;
    const selectedPickupLocation = location.state?.selectedPickupLocation;
    const selectedDropOffLocation = location.state?.selectedDropOffLocation;

    const handleMapSelection = () => {
        navigate('/maps-location-select', {
            state: {
                selectedCar,
                selectedPickupLocation,
                selectedDropOffLocation,
                returnTo: '/make-booking'
            }
        });
    };

    const handleListSelection = () => {
        navigate('/choose-location', {
            state: {
                selectedCar,
                selectedPickupLocation,
                selectedDropOffLocation
            }
        });
    };

    const handleSkipToBooking = () => {
        navigate('/make-booking', {
            state: {
                selectedCar,
                selectedPickupLocation,
                selectedDropOffLocation
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat'
                }}></div>
            </div>

            <div className="relative z-10">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-b border-white/10">
                    <div className="container mx-auto px-6 py-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                                <span className="text-white font-bold text-2xl">📍</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                                Choose Location Selection Method
                            </h1>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
                                Select how you'd like to choose your pickup and drop-off locations
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-12">
                    <div className="max-w-5xl mx-auto">
                        {/* Selected Car Display */}
                        {selectedCar && (
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-6 mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white text-sm font-bold">✓</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Selected Car</h3>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
                                    <h4 className="text-xl font-semibold text-white mb-2">
                                        {selectedCar.brand} {selectedCar.model}
                                    </h4>
                                    <p className="text-gray-300">
                                        {selectedCar.year} • R{selectedCar.rentalPrice}/day
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Location Selection Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Map-Based Selection */}
                            <div className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-8 hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                                onClick={handleMapSelection}>
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-white font-bold text-3xl">🗺️</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        Interactive Map
                                    </h3>
                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        Search and select locations using Google Maps with autocomplete and route visualization
                                    </p>
                                    <ul className="text-left text-gray-400 space-y-2 mb-6">
                                        <li className="flex items-start">
                                            <span>Search any address in South Africa</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span>View driving route on map</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span>Precise location selection</span>
                                        </li>
                                    </ul>
                                    <button className="w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg transition-all duration-300 transform group-hover:scale-105">
                                        Use Map
                                    </button>
                                </div>
                            </div>

                            {/* List-Based Selection */}
                            <div className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-8 hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                                onClick={handleListSelection}>
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-white font-bold text-3xl"></span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        Location List
                                    </h3>
                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        Choose from our pre-registered pickup and drop-off locations across South Africa
                                    </p>
                                    <ul className="text-left text-gray-400 space-y-2 mb-6">
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">✓</span>
                                            <span>Filter by province</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">✓</span>
                                            <span>Search by city or name</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">✓</span>
                                            <span>Quick and simple selection</span>
                                        </li>
                                    </ul>
                                    <button className="w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all duration-300 transform group-hover:scale-105">
                                        Use List
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={handleSkipToBooking}
                                className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg transition-all duration-300"
                            >
                                {(selectedPickupLocation && selectedDropOffLocation) 
                                    ? 'Skip to Booking' 
                                    : 'Continue Without Locations'}
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg transition-all duration-300"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationChoice;

