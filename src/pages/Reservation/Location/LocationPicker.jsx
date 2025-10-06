/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
Updated: 06/01/2025 - Integrated with Google Maps
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LocationPicker({ onLocationSelect, selectedLocation, placeholder = "Choose a location" }){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleMapSelection = () => {
        setIsLoading(true);
        navigate('/maps', {
            state: {
                returnTo: window.location.pathname,
                currentLocation: selectedLocation,
                onLocationSelect: onLocationSelect
            }
        });
    };

    return(
        <div className="location-picker">
            <label htmlFor="location" className="block mb-2 font-semibold text-white">
                {placeholder}:
            </label>
            
            {/* Display selected location */}
            {selectedLocation ? (
                <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-400 font-medium">{selectedLocation}</p>
                            <p className="text-green-300 text-sm">Location selected</p>
                        </div>
                        <button
                            onClick={handleMapSelection}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mb-4 p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                    <p className="text-gray-400 text-sm">No location selected</p>
                </div>
            )}

            {/* Map Selection Button */}
            <button
                type="button"
                onClick={handleMapSelection}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <span className="mr-2 font-bold">M</span>
                        {selectedLocation ? 'Change Location on Map' : 'Select Location on Map'}
                    </div>
                )}
            </button>

            {/* Alternative: Quick location selection */}
            <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Or choose from popular locations:</p>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => onLocationSelect && onLocationSelect("Johannesburg CBD")}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                    >
                        Johannesburg CBD
                    </button>
                    <button
                        type="button"
                        onClick={() => onLocationSelect && onLocationSelect("Sandton City")}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                    >
                        Sandton City
                    </button>
                    <button
                        type="button"
                        onClick={() => onLocationSelect && onLocationSelect("OR Tambo Airport")}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                    >
                        OR Tambo Airport
                    </button>
                    <button
                        type="button"
                        onClick={() => onLocationSelect && onLocationSelect("Rosebank")}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                    >
                        Rosebank
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LocationPicker;