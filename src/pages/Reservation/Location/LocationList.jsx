/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
 */
import React, { useEffect, useState } from "react";
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <table>
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Location Name</th>
                        <th className="px-4 py-2 border">Street Name</th>
                        <th className="px-4 py-2 border">City or Town</th>
                        <th className="px-4 py-2 border">Province or State</th>
                        <th className="px-4 py-2 border">Country</th>
                        <th className="px-4 py-2 border">Postal Code</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {locations.map(loc => (
                    <tr key={loc.locationID}>
                        <td className="px-4 py-2 border">{loc.locationName}</td>
                        <td className="px-4 py-2 border">{loc.streetName}</td>
                        <td className="px-4 py-2 border">{loc.cityOrTown}</td>
                        <td className="px-4 py-2 border">{loc.provinceOrState}</td>
                        <td className="px-4 py-2 border">{loc.country}</td>
                        <td className="px-4 py-2 border">{loc.postalCode}</td>
                        <td className="px-4 py-2 border">
                            <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 mr-2">Edit</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
          </table>
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => navigate("/")}>Back</button>
      </div>
  );
}

export default LocationList;