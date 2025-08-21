/*
Lisakhanya Zumana (230864821)
Date: 05/06/2025
 */
function BookingForm() {
    return (
        <div>
            <h2> Make a Booking </h2>
            <form>
                <label> Car being booked </label><br/>
                <input type="text" name="car" placeholder="Enter car name" required/><br/>
                <label> Booking Date </label><br/>
                <input type="date" name="bookingDate" required/><br/>
                <label> Start Date and Time</label><br/>
                <input type="datetime-local" name="startDateTime" required/><br/>
                <label> End Date and Time</label><br/>
                <input type="datetime-local" name="endDateTime" required/><br/>
                <label> Pick-up Location </label>
                <input type="choice" name="pickupLocation" required/><br/>
                <label> Drop-off Location </label>
                <input type="choice" name="dropoffLocation" required/><br/>
                <label> Booking Status </label><br/>
                <select name="bookingStatus" required>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                </select><br/>
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
                <button type="cancel">Cancel</button>
            </form>
        </div>
    );
}

export default BookingForm;