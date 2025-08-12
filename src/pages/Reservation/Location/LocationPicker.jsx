function LocationPicker(){
    return(
        <div className="location-picker">
            <label htmlFor="location">Choose a location:</label>
            <select id="location" name="location">
                <option value="location1">Location 1</option>
                <option value="location2">Location 2</option>
                <option value="location3">Location 3</option>
            </select>
        </div>
    );

}
export default LocationPicker;