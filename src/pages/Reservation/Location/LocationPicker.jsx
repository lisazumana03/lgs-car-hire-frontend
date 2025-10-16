/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
Updated: 06/01/2025 - Simple text input only
*/

function LocationPicker({ onLocationSelect, selectedLocation, placeholder = "Choose a location" }) {
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (onLocationSelect) {
            onLocationSelect(value);
        }
    };

    return (
        <div className="location-picker mb-4">
            <label htmlFor="location-input" className="block mb-2 font-semibold text-white">
                {placeholder}
            </label>
            
            {/* Text input for location */}
            <input
                id="location-input"
                type="text"
                value={selectedLocation || ''}
                onChange={handleInputChange}
                placeholder="Enter location name (e.g., Stellenbosch, Century City)..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            
            <p className="mt-2 text-gray-400 text-sm">
                Type the location name - the backend will handle it automatically
            </p>
        </div>
    );
}

export default LocationPicker;
