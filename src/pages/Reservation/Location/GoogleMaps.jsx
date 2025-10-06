/*
Lisakhanya Zumana (230864821)
Date: 06/01/2025
Google Maps Component for Location Selection
*/

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Map component that renders Google Maps
function Map({ center, zoom, onLocationSelect, isPickup = true }) {
    const ref = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        if (ref.current && !map) {
            const googleMap = new window.google.maps.Map(ref.current, {
                center,
                zoom,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
                zoomControl: true,
            });
            setMap(googleMap);
        }
    }, [ref, map, center, zoom]);

    useEffect(() => {
        if (map) {
            // Clear existing marker
            if (marker) {
                marker.setMap(null);
            }

            // Add click listener to map
            const clickListener = map.addListener('click', (event) => {
                const location = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                };

                // Create new marker
                const newMarker = new window.google.maps.Marker({
                    position: location,
                    map: map,
                    title: isPickup ? 'Pickup Location' : 'Drop-off Location',
                    draggable: true,
                    animation: window.google.maps.Animation.DROP,
                });

                // Add drag listener to marker
                const dragListener = newMarker.addListener('dragend', () => {
                    const newPosition = newMarker.getPosition();
                    const newLocation = {
                        lat: newPosition.lat(),
                        lng: newPosition.lng(),
                    };
                    onLocationSelect(newLocation);
                });

                setMarker(newMarker);
                onLocationSelect(location);

                // Get address using Geocoding API
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const address = results[0].formatted_address;
                        console.log(`${isPickup ? 'Pickup' : 'Drop-off'} location: ${address}`);
                    }
                });
            });

            // Cleanup listener
            return () => {
                window.google.maps.event.removeListener(clickListener);
                if (marker) {
                    marker.setMap(null);
                }
            };
        }
    }, [map, onLocationSelect, isPickup, marker]);

    return <div ref={ref} style={{ height: '400px', width: '100%' }} />;
}

// Geocoding component for address search
function GeocodingSearch({ onLocationSelect, placeholder = "Search for a location..." }) {
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const autocompleteService = useRef(null);
    const placesService = useRef(null);

    useEffect(() => {
        if (window.google && window.google.maps) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
            placesService.current = new window.google.maps.places.PlacesService(
                document.createElement('div')
            );
        }
    }, []);

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
        
        if (!value || value.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        
        autocompleteService.current.getPlacePredictions(
            {
                input: value,
                types: ['establishment', 'geocode'],
            },
            (predictions, status) => {
                setIsLoading(false);
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setSuggestions(predictions || []);
                } else {
                    setSuggestions([]);
                }
            }
        );
    }, []);

    const handleSuggestionClick = useCallback((prediction) => {
        setSearchValue(prediction.description);
        setSuggestions([]);

        placesService.current.getDetails(
            {
                placeId: prediction.place_id,
                fields: ['geometry', 'name', 'formatted_address'],
            },
            (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
                    const location = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    };
                    onLocationSelect(location, place.formatted_address);
                }
            }
        );
    }, [onLocationSelect]);

    return (
        <div className="relative">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            {isLoading && (
                <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
            )}
            {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((prediction, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(prediction)}
                            className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white border-b border-gray-600 last:border-b-0"
                        >
                            <div className="font-medium">{prediction.structured_formatting.main_text}</div>
                            <div className="text-sm text-gray-300">{prediction.structured_formatting.secondary_text}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Main GoogleMaps component
function GoogleMaps({ onPickupSelect, onDropoffSelect, pickupLocation, dropoffLocation }) {
    const [pickup, setPickup] = useState(pickupLocation || { lat: -26.2041, lng: 28.0473 }); // Default to Johannesburg
    const [dropoff, setDropoff] = useState(dropoffLocation || { lat: -26.2041, lng: 28.0473 });
    const [activeTab, setActiveTab] = useState('pickup');

    const handlePickupSelect = useCallback((location, address) => {
        setPickup(location);
        if (onPickupSelect) {
            onPickupSelect(location, address);
        }
    }, [onPickupSelect]);

    const handleDropoffSelect = useCallback((location, address) => {
        setDropoff(location);
        if (onDropoffSelect) {
            onDropoffSelect(location, address);
        }
    }, [onDropoffSelect]);

    const render = (status) => {
        switch (status) {
            case Status.LOADING:
                return (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-white">Loading Google Maps...</span>
                    </div>
                );
            case Status.FAILURE:
                return (
                    <div className="flex items-center justify-center h-96 bg-red-900/20 rounded-lg">
                        <div className="text-center">
                            <div className="text-red-400 text-xl mb-2">⚠️</div>
                            <div className="text-red-400 font-semibold">Failed to load Google Maps</div>
                            <div className="text-red-300 text-sm mt-1">Please check your API key and internet connection</div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="w-full">
                        {/* Search and Tab Interface */}
                        <div className="mb-6">
                            <div className="flex mb-6 bg-white/5 rounded-xl p-1 border border-white/10">
                                <button
                                    onClick={() => setActiveTab('pickup')}
                                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                        activeTab === 'pickup'
                                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex items-center justify-center">
                                        <span className="mr-2 font-bold text-sm">P</span>
                                        Pickup Location
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('dropoff')}
                                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                        activeTab === 'dropoff'
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex items-center justify-center">
                                        <span className="mr-2 font-bold text-sm">D</span>
                                        Drop-off Location
                                    </div>
                                </button>
                            </div>

                            <GeocodingSearch
                                onLocationSelect={activeTab === 'pickup' ? handlePickupSelect : handleDropoffSelect}
                                placeholder={`Search for ${activeTab === 'pickup' ? 'pickup' : 'drop-off'} location...`}
                            />
                        </div>

                        {/* Map */}
                        <div className="border border-white/20 rounded-xl overflow-hidden shadow-2xl">
                            <Map
                                center={activeTab === 'pickup' ? pickup : dropoff}
                                zoom={15}
                                onLocationSelect={activeTab === 'pickup' ? handlePickupSelect : handleDropoffSelect}
                                isPickup={activeTab === 'pickup'}
                            />
                        </div>

                    </div>
                );
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                    Interactive Map Selection
                </h2>
                <p className="text-gray-300 text-sm">
                    Click on the map or use the search bar to set your locations
                </p>
            </div>
            
            <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render} />
        </div>
    );
}

export default GoogleMaps;
