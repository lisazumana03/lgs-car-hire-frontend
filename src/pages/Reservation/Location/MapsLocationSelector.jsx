/*
Maps Location Selector - Integrated Google Maps for booking flow
Allows users to select pickup and drop-off locations using Google Maps
*/

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleMaps from './GoogleMaps';

function MapsLocationSelector() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCar, returnTo = '/make-booking' } = location.state || {};
    
    const [pickupAddress, setPickupAddress] = useState('');
    const [dropoffAddress, setDropoffAddress] = useState('');
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);

    const handlePickupSelect = (coords, address) => {
        setPickupCoords(coords);
        if (address) {
            setPickupAddress(address);
        }
    };

    const handleDropoffSelect = (coords, address) => {
        setDropoffCoords(coords);
        if (address) {
            setDropoffAddress(address);
        }
    };

    const handleProceedToBooking = () => {
        if (!pickupAddress || !dropoffAddress) {
            alert('Please enter both pickup and drop-off locations');
            return;
        }

        if (!pickupCoords || !dropoffCoords) {
            alert('Please select valid locations from the suggestions');
            return;
        }

        // Create location objects - these will be text-based locations
        // The backend should handle these as address strings, not database locations
        const pickupLocationData = {
            locationName: pickupAddress.split(',')[0].trim(),
            streetName: pickupAddress,
            cityOrTown: extractCity(pickupAddress),
            provinceOrState: extractProvince(pickupAddress),
            country: 'South Africa',
            postalCode: '',
            latitude: pickupCoords.lat,
            longitude: pickupCoords.lng,
            // Add full address for easy reference
            fullAddress: pickupAddress
        };

        const dropoffLocationData = {
            locationName: dropoffAddress.split(',')[0].trim(),
            streetName: dropoffAddress,
            cityOrTown: extractCity(dropoffAddress),
            provinceOrState: extractProvince(dropoffAddress),
            country: 'South Africa',
            postalCode: '',
            latitude: dropoffCoords.lat,
            longitude: dropoffCoords.lng,
            // Add full address for easy reference
            fullAddress: dropoffAddress
        };

        // Navigate to booking with location data
        navigate(returnTo, {
            state: {
                selectedCar,
                selectedPickupLocation: pickupLocationData,
                selectedDropOffLocation: dropoffLocationData,
                pickupCoords,
                dropoffCoords
            }
        });
    };

    // Helper function to extract city from address
    const extractCity = (address) => {
        const parts = address.split(',');
        if (parts.length >= 2) {
            return parts[parts.length - 2].trim();
        }
        return 'Unknown';
    };

    // Helper function to extract province from address
    const extractProvince = (address) => {
        const provinces = [
            'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
            'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
        ];
        
        for (const province of provinces) {
            if (address.includes(province)) {
                return province;
            }
        }
        return 'Gauteng'; // Default
    };

    const handleCancel = () => {
        navigate(-1);
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
                                <span className="text-white font-bold text-2xl">🗺️</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                                Select Locations on Map
                            </h1>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
                                Search and choose your pickup and drop-off locations using our interactive map
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-8">
                    <div className="max-w-7xl mx-auto">
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

                        {/* Google Maps Component */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-6 mb-8">
                            <GoogleMaps
                                onPickupSelect={handlePickupSelect}
                                onDropoffSelect={handleDropoffSelect}
                                initialPickup={pickupAddress}
                                initialDropoff={dropoffAddress}
                            />
                        </div>

                        {/* Selected Locations Summary */}
                        {(pickupAddress || dropoffAddress) && (
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-8 mb-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white text-sm font-bold">✓</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Selected Locations</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white text-xs font-bold">P</span>
                                            </div>
                                            <h4 className="text-green-400 font-semibold text-lg">Pickup Location</h4>
                                        </div>
                                        <p className="text-green-100 text-base mb-2">
                                            {pickupAddress || 'Not selected'}
                                        </p>
                                        {pickupCoords && (
                                            <div className="bg-green-500/20 rounded-lg p-3 mt-3">
                                                <p className="text-green-300 text-sm font-mono">
                                                    Lat: {pickupCoords.lat.toFixed(6)}
                                                </p>
                                                <p className="text-green-300 text-sm font-mono">
                                                    Lng: {pickupCoords.lng.toFixed(6)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white text-xs font-bold">D</span>
                                            </div>
                                            <h4 className="text-blue-400 font-semibold text-lg">Drop-off Location</h4>
                                        </div>
                                        <p className="text-blue-100 text-base mb-2">
                                            {dropoffAddress || 'Not selected'}
                                        </p>
                                        {dropoffCoords && (
                                            <div className="bg-blue-500/20 rounded-lg p-3 mt-3">
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
                                onClick={handleProceedToBooking}
                                disabled={!pickupAddress || !dropoffAddress || !pickupCoords || !dropoffCoords}
                                className={`group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                                    pickupAddress && dropoffAddress && pickupCoords && dropoffCoords
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <span className="flex items-center justify-center">
                                    <span className="mr-2 font-bold">→</span>
                                    Proceed to Booking
                                </span>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="group relative px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <span className="flex items-center justify-center">
                                    <span className="mr-2 font-bold">×</span>
                                    Cancel
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapsLocationSelector;

