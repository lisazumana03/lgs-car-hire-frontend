/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLocations } from "../../../services/locationService";

function LocationList() {
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllLocations()
            .then(res => setLocations(res.data))
            .catch(() => setLocations([]));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl p-6">
                {locations.map(loc => (
                    <div key={loc.locationID} className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
                        <h3 className="text-xl font-bold text-red-700 mb-2">{loc.locationName}</h3>
                        <p className="text-gray-700"><span className="font-semibold">Street:</span> {loc.streetName}</p>
                        <p className="text-gray-700"><span className="font-semibold">City/Town:</span> {loc.cityOrTown}</p>
                        <p className="text-gray-700"><span className="font-semibold">Province/State:</span> {loc.provinceOrState}</p>
                        <p className="text-gray-700"><span className="font-semibold">Country:</span> {loc.country}</p>
                        <p className="text-gray-700"><span className="font-semibold">Postal Code:</span> {loc.postalCode}</p>
                        <div className="mt-4 flex gap-2">
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700">Edit</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-6"
                onClick={() => navigate("/")}
            >
                Back
            </button>
        </div>
    );
}

export default LocationList;