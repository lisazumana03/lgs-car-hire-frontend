/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
 */

function LocationPicker(){
    return(
        <div className="location-picker">
            <h2 className="text-center text-2xl font-bold mb-4">Location Options</h2>
            <div className="location-links flex gap-4 mb-4 justify-center">
                <a
                    href="/register-location"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800"
                >
                    Add Location
                </a>
                <a
                    href="/view-locations"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800"
                >
                    View Locations
                </a>
            </div>
        </div>
    );

}
export default LocationPicker;