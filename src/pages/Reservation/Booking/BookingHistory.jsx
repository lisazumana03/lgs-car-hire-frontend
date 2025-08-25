/*
Lisakhanya Zumana (230864821)
Date: 13/08/2025
 */
function BookingHistory(){
    return(
        <div className="booking-history">
            <h2>Booking History</h2>
            <p>Here you can view your past bookings.</p>
            {/* Booking history content will go here */}
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => navigate("/")}>Back</button>
        </div>
    )
}

export default BookingHistory;