/*
Lisakhanya Zumana (230864821)
Date: 06/01/2025
Maps Page Component for Location Selection
*/

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleMaps from './GoogleMaps';

function MapsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { returnTo = '/booking', bookingData = {} } = location.state || {};
    
    const [pickupLocation, setPickupLocation] = useState(bookingData.pickupLocation || '');
    const [dropoffLocation, setDropoffLocation] = useState(bookingData.dropoffLocation || '');
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);

    const handlePickupSelect = (location, address) => {
        setPickupCoords(location);
        if (address) {
            setPickupLocation(address);
        }
    };

    const handleDropoffSelect = (location, address) => {
        setDropoffCoords(location);
        if (address) {
            setDropoffLocation(address);
        }
    };

    const handleSaveLocations = () => {
        if (!pickupLocation || !dropoffLocation) {
            alert('Please select both pickup and drop-off locations');
            return;
        }

        // Return to the calling page with location data
        navigate(returnTo, {
            state: {
                ...location.state,
                locations: {
                    pickupLocation,
                    dropoffLocation,
                    pickupCoords,
                    dropoffCoords
                }
            }
        });
    };

    const handleCancel = () => {
        navigate(returnTo);
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
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                                Location Selection
                            </h1>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
                                Choose your pickup and drop-off locations with our interactive map interface
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Maps Component */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-6 mb-8">
                            <GoogleMaps
                                onPickupSelect={handlePickupSelect}
                                onDropoffSelect={handleDropoffSelect}
                                pickupLocation={pickupCoords}
                                dropoffLocation={dropoffCoords}
                            />
                        </div>

                        {/* Selected Locations Summary */}
                        {(pickupLocation || dropoffLocation) && (
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-8 mb-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white text-sm font-bold">✓</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Selected Locations</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white text-xs font-bold">P</span>
                                            </div>
                                            <h4 className="text-green-400 font-semibold text-lg">Pickup Location</h4>
                                        </div>
                                        <p className="text-green-100 text-base mb-2">
                                            {pickupLocation || 'Not selected'}
                                        </p>
                                        {pickupCoords && (
                                            <div className="bg-green-500/20 rounded-lg p-3">
                                                <p className="text-green-300 text-sm font-mono">
                                                    Lat: {pickupCoords.lat.toFixed(6)}
                                                </p>
                                                <p className="text-green-300 text-sm font-mono">
                                                    Lng: {pickupCoords.lng.toFixed(6)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white text-xs font-bold">D</span>
                                            </div>
                                            <h4 className="text-blue-400 font-semibold text-lg">Drop-off Location</h4>
                                        </div>
                                        <p className="text-blue-100 text-base mb-2">
                                            {dropoffLocation || 'Not selected'}
                                        </p>
                                        {dropoffCoords && (
                                            <div className="bg-blue-500/20 rounded-lg p-3">
                                                <p className="text-blue-300 text-sm font-mono">
                                                    Lat: {dropoffCoords.lat.toFixed(6)}
                                                </p>
                                                <p className="text-blue-300 text-sm font-mono">
                                                    Lng: {dropoffCoords.lng.toFixed(6)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                            <button
                                onClick={handleSaveLocations}
                                disabled={!pickupLocation || !dropoffLocation}
                                className={`group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                                    pickupLocation && dropoffLocation
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <span className="flex items-center justify-center">
                                    <span className="mr-2 font-bold">✓</span>
                                    Save Locations
                                </span>
                                {pickupLocation && dropoffLocation && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="group relative px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <span className="flex items-center justify-center">
                                    <span className="mr-2 font-bold">×</span>
                                    Cancel
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </button>
                        </div>

                        {/* Quick Access Section */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-8">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-white mb-2">Quick Navigation</h3>
                                <p className="text-gray-300">Jump to other parts of the application</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <button
                                    onClick={() => navigate('/make-booking')}
                                    className="group bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/40 hover:to-blue-700/40 border border-blue-500/30 hover:border-blue-400/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-center justify-center mb-2">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">B</span>
                                        </div>
                                    </div>
                                    <h4 className="text-blue-300 font-semibold group-hover:text-blue-200">Booking Form</h4>
                                    <p className="text-blue-400/70 text-sm mt-1">Create new booking</p>
                                </button>
                                <button
                                    onClick={() => navigate('/select-car')}
                                    className="group bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/40 hover:to-blue-700/40 border border-blue-500/30 hover:border-blue-400/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-center justify-center mb-2">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">C</span>
                                        </div>
                                    </div>
                                    <h4 className="text-blue-300 font-semibold group-hover:text-blue-200">Car Selection</h4>
                                    <p className="text-blue-400/70 text-sm mt-1">Browse available cars</p>
                                </button>
                                <button
                                    onClick={() => navigate('/bookings')}
                                    className="group bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/40 hover:to-blue-700/40 border border-blue-500/30 hover:border-blue-400/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-center justify-center mb-2">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">H</span>
                                        </div>
                                    </div>
                                    <h4 className="text-blue-300 font-semibold group-hover:text-blue-200">My Bookings</h4>
                                    <p className="text-blue-400/70 text-sm mt-1">View booking history</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapsPage;
