import React, { useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import "./MapComponent.css";

export default function MapComponent() {
    const [pickup, setPickup] = useState(null);
    const [dropoff, setDropoff] = useState(null);
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // replace with your key

    // Function to handle map click
    const handleMapClick = useCallback((e) => {
        const lat = e.detail.latLng.lat;
        const lng = e.detail.latLng.lng;

        if (!pickup) {
            setPickup({ lat, lng });
        } else {
            setDropoff({ lat, lng });
        }
    }, [pickup]);

    return (
        <APIProvider apiKey={apiKey}>
            <div className="map-container">
                <Map
                    style={{ height: "400px", width: "100%" }}
                    defaultCenter={{ lat: -33.8, lng: 18.48 }}
                    defaultZoom={13}
                    onClick={handleMapClick}
                >
                    {pickup && (
                        <AdvancedMarker position={pickup}>
                            <span>📍</span>
                        </AdvancedMarker>
                    )}

                    {dropoff && (
                        <AdvancedMarker position={dropoff}>
                            <span>🏁</span>
                        </AdvancedMarker>
                    )}
                </Map>
            </div>

            <div className="location-info">
                {pickup && (
                    <div className="info-box">
                        <h4>📍 Pickup Location</h4>
                        <p>{pickup.lat.toFixed(6)}, {pickup.lng.toFixed(6)}</p>
                        <a
                            href={`https://www.google.com/maps?q=${pickup.lat},${pickup.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                >
                                Open Pickup in Google Maps
                                </a>
                                </div>
                                )}

                            {dropoff && (
                                <div className="info-box">
                                    <h4>🏁 Dropoff Location</h4>
                                    <p>{dropoff.lat.toFixed(6)}, {dropoff.lng.toFixed(6)}</p>
                                    <a
                                        href={`https://www.google.com/maps?q=${dropoff.lat},${dropoff.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            >
                                            Open Dropoff in Google Maps
                                            </a>
                                            </div>
                                            )}
                                </div>
                                </APIProvider>
                                );
                            }