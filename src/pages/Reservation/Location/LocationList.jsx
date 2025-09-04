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

    const mockData = [
    {
        locationID: 1,
        locationName: "Usasaza Branch",
        streetName: "R58",
        cityOrTown: "Colesberg",
        provinceOrState: "Northern Cape",
        country: "South Africa",
        postalCode: "9795"
    },
    {
        locationID: 2,
        locationName: "Karoo Branch",
        streetName: "N1 Donkin Street",
        cityOrTown: "Beaufort West",
        provinceOrState: "Western Cape",
        country: "South Africa",
        postalCode: "6970"
    },
    {
        locationID: 3,
        locationName: "CPT Branch",
        streetName: "CTIA Road",
        cityOrTown: "Cape Town",
        provinceOrState: "Western Cape",
        country: "South Africa",
        postalCode: "7788"
    }]

    useEffect(() => {
        getAllLocations()
            .then(res => {
                setLocations([...mockData, ...res.data])
            })
            .catch(() =>
            {setLocations(mockData)});
    }, []);


    return (
        <div>
            <div className="form">
                <h2 className="text-2xl font-bold text-center text-white mb-8">View Locations</h2>
                {locations.map(loc => (
                    <div key={loc.locationID} className="bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2">{loc.locationName}</h3>
                        <p className="text-white"><span className="font-semibold">Street:</span> {loc.streetName}</p>
                        <p className="text-white"><span className="font-semibold">City/Town:</span> {loc.cityOrTown}</p>
                        <p className="text-white"><span className="font-semibold">Province/State:</span> {loc.provinceOrState}</p>
                        <p className="text-white"><span className="font-semibold">Country:</span> {loc.country}</p>
                        <p className="text-white"><span className="font-semibold">Postal Code:</span> {loc.postalCode}</p>
                        <div className="mt-4 flex gap-2">
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700">Edit</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <button
                type="button"
                style={{ marginTop: "20px", backgroundColor: "#003ffa" }}
                className="submit-btn"
                onClick={() => navigate("/dashboard")}
            >
                Back
            </button>
        </div>
    );
}

export default LocationList;