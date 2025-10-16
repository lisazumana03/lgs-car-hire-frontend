/*
Lisakhanya Zumana (230864821)
Date: 06/01/2025
Google Maps Component for Location Selection with Directions
*/

import React, { useState, useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Map component with directions
function MapWithDirections({ 
    pickupLocation, 
    dropoffLocation, 
    onPickupSelect, 
    onDropoffSelect 
}) {
    const ref = useRef(null);
    const [map, setMap] = useState(null);
    const [pickupMarker, setPickupMarker] = useState(null);
    const [dropoffMarker, setDropoffMarker] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);

    // Initialize map
    useEffect(() => {
        if (ref.current && !map) {
            const googleMap = new window.google.maps.Map(ref.current, {
                center: { lat: -26.2041, lng: 28.0473 }, // Johannesburg
                zoom: 12,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
                zoomControl: true,
            });
            
            const renderer = new window.google.maps.DirectionsRenderer({
                map: googleMap,
                suppressMarkers: false, // Show default markers
            });
            
            setMap(googleMap);
            setDirectionsRenderer(renderer);
        }
    }, [ref, map]);

    // Update pickup marker
    useEffect(() => {
        if (map && pickupLocation) {
            // Clear existing pickup marker
            if (pickupMarker) {
                pickupMarker.setMap(null);
            }

            // Create new pickup marker
            const marker = new window.google.maps.Marker({
                position: pickupLocation,
                map: map,
                title: 'Pickup Location',
                label: 'P',
                animation: window.google.maps.Animation.DROP,
            });

            setPickupMarker(marker);
            map.panTo(pickupLocation);
        }
    }, [map, pickupLocation]);
    }, [map, pickupLocation, pickupMarker]);

    // Update dropoff marker
    useEffect(() => {
        if (map && dropoffLocation) {
            // Clear existing dropoff marker
            if (dropoffMarker) {
                dropoffMarker.setMap(null);
            }

            // Create new dropoff marker
            const marker = new window.google.maps.Marker({
                position: dropoffLocation,
                map: map,
                title: 'Drop-off Location',
                label: 'D',
                animation: window.google.maps.Animation.DROP,
            });

            setDropoffMarker(marker);
        }
    }, [map, dropoffLocation]);
    }, [map, dropoffLocation, dropoffMarker]);

    // Calculate and display directions
    useEffect(() => {
        if (map && directionsRenderer && pickupLocation && dropoffLocation) {
            const directionsService = new window.google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: pickupLocation,
                    destination: dropoffLocation,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === 'OK') {
                        directionsRenderer.setDirections(result);
                        
                        // Hide our custom markers when showing directions
                        if (pickupMarker) pickupMarker.setMap(null);
                        if (dropoffMarker) dropoffMarker.setMap(null);
                    } else {
                        console.error('Directions request failed:', status);
                    }
                }
            );
        } else if (directionsRenderer) {
            // Clear directions if locations are removed
            directionsRenderer.setDirections({ routes: [] });
        }
    }, [map, directionsRenderer, pickupLocation, dropoffLocation, pickupMarker, dropoffMarker]);

    return <div ref={ref} style={{ height: '500px', width: '100%', borderRadius: '8px' }} />;
}

// Address input component with autocomplete
function AddressInput({ 
    label, 
    placeholder, 
    value, 
    onChange, 
    onLocationSelect 
}) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const autocompleteService = useRef(null);
    const geocoder = useRef(null);

    useEffect(() => {
        if (window.google && window.google.maps) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
            geocoder.current = new window.google.maps.Geocoder();
        }
    }, []);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);

        if (newValue.length > 2 && autocompleteService.current) {
            autocompleteService.current.getPlacePredictions(
                {
                    input: newValue,
                    componentRestrictions: { country: 'za' }, // South Africa
                },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                        setSuggestions(predictions);
                        setShowSuggestions(true);
                    }
                }
            );
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        onChange(suggestion.description);
        setShowSuggestions(false);
        setSuggestions([]);

        // Geocode the address to get coordinates
        if (geocoder.current) {
            geocoder.current.geocode(
                { address: suggestion.description },
                (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const location = {
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng(),
                        };
                        onLocationSelect(location, suggestion.description);
                    }
                }
            );
        }
    };

    return (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
            <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#007bff'
            }}>
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #007bff',
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                }}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#2c2c2c',
                    border: '2px solid #007bff',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                }}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.place_id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                                padding: '12px',
                                cursor: 'pointer',
                                borderBottom: index < suggestions.length - 1 ? '1px solid #444' : 'none',
                                backgroundColor: '#2c2c2c',
                                color: 'white',
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#007bff'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#2c2c2c'}
                        >
                            <div style={{ fontWeight: '600' }}>
                                {suggestion.structured_formatting.main_text}
                            </div>
                            <div style={{ fontSize: '12px', color: '#aaa' }}>
                                {suggestion.structured_formatting.secondary_text}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Main Google Maps component
export default function GoogleMaps({ 
    onPickupSelect, 
    onDropoffSelect,
    initialPickup = '',
    initialDropoff = ''
}) {
    const [pickupAddress, setPickupAddress] = useState(initialPickup);
    const [dropoffAddress, setDropoffAddress] = useState(initialDropoff);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);

    const handlePickupLocationSelect = (location, address) => {
        setPickupLocation(location);
        if (address) setPickupAddress(address);
        if (onPickupSelect) onPickupSelect(location, address || pickupAddress);
    };

    const handleDropoffLocationSelect = (location, address) => {
        setDropoffLocation(location);
        if (address) setDropoffAddress(address);
        if (onDropoffSelect) onDropoffSelect(location, address || dropoffAddress);
    };

    const render = (status) => {
        if (status === Status.LOADING) return <h3>Loading Maps...</h3>;
        if (status === Status.FAILURE) return <h3>Error loading maps</h3>;
        return null;
    };

    return (
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render} libraries={['places']}>
            <div style={{ padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '12px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <AddressInput
                        label=" Pickup Location"
                        placeholder="Enter pickup address (e.g., Sandton City, Johannesburg)"
                        value={pickupAddress}
                        onChange={setPickupAddress}
                        onLocationSelect={handlePickupLocationSelect}
                    />
                    
                    <AddressInput
                        label=" Drop-off Location"
                        placeholder="Enter drop-off address (e.g., OR Tambo Airport)"
                        value={dropoffAddress}
                        onChange={setDropoffAddress}
                        onLocationSelect={handleDropoffLocationSelect}
                    />
                </div>

                <MapWithDirections
                    pickupLocation={pickupLocation}
                    dropoffLocation={dropoffLocation}
                    onPickupSelect={handlePickupLocationSelect}
                    onDropoffSelect={handleDropoffLocationSelect}
                />

                {pickupLocation && dropoffLocation && (
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '15px', 
                        backgroundColor: '#2c2c2c', 
                        borderRadius: '8px',
                        border: '2px solid #28a745'
                    }}>
                        <div style={{ color: '#28a745', fontWeight: '600', marginBottom: '10px' }}>
                            ✓ Route calculated successfully
                        </div>
                        <div style={{ fontSize: '14px', color: '#aaa' }}>
                            Blue route shows the driving directions from pickup to drop-off location
                        </div>
                    </div>
                )}
            </div>
        </Wrapper>
    );
}
