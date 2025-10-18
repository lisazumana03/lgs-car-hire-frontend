import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { bookingAPI, BookingDTO } from "@/services/api";
import { Calendar, Car, MapPin, CreditCard, ArrowLeft, Search, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import Header from "@/components/Header";

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const allBookings = await bookingAPI.getAll();
        console.log("All bookings from API:", allBookings);
        console.log("Current user ID:", user.id);

        const userBookings = allBookings.filter(b => {
          // Backend returns userId, not id
          const bookingUserId = b.user?.userId || b.user?.id;
          console.log("Checking booking:", b, "User ID in booking:", bookingUserId);
          return b.user && bookingUserId === user.id;
        });

        console.log("Filtered user bookings:", userBookings);

        // Sort by booking date (most recent first)
        const sortedBookings = userBookings.sort(
          (a, b) => new Date(b.bookingDateAndTime).getTime() - new Date(a.bookingDateAndTime).getTime()
        );

        setBookings(sortedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED": return "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400";
      case "PENDING": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-400";
      case "CANCELLED": return "text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400";
      case "DECLINED": return "text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400";
      case "BOOKED": return "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950/30 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleViewDetails = (booking: BookingDTO) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelClick = (booking: BookingDTO) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancellingBooking(selectedBooking.bookingID);

      // Debug: Check if token exists
      const token = localStorage.getItem("token");
      console.log("Token exists:", !!token);
      console.log("Token preview:", token ? token.substring(0, 20) + "..." : "No token");

      // Try the cancel endpoint first (has 45-minute window restriction)
      try {
        console.log("Attempting DELETE /api/booking/cancel/" + selectedBooking.bookingID);
        await api.delete(`/api/booking/cancel/${selectedBooking.bookingID}`);
        console.log("Cancel successful!");
      } catch (cancelError: any) {
        console.log("Cancel failed:", cancelError.response?.status, cancelError.response?.data);
        // If cancel fails (likely past 45-minute window), use update endpoint
        // PUT /api/booking/update expects the full booking object (no ID in URL)
        console.log("Attempting PUT /api/booking/update with booking:", selectedBooking);
        await api.put(`/api/booking/update`, {
          ...selectedBooking,
          bookingStatus: "CANCELLED"
        });
        console.log("Update successful!");
      }

      // Update the booking in the list
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingID === selectedBooking.bookingID
            ? { ...b, bookingStatus: "CANCELLED" as any }
            : b
        )
      );

      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      setSelectedBooking(null);
    } catch (error: any) {
      console.error("Failed to cancel booking:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      toast.error(error.response?.data?.message || "Failed to cancel booking. Please try again.");
    } finally {
      setCancellingBooking(null);
    }
  };

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    // Status filter
    if (statusFilter !== "ALL" && booking.bookingStatus !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchQuery === "") return true;

    const query = searchQuery.toLowerCase();
    return (
      booking.car.brand.toLowerCase().includes(query) ||
      booking.car.model.toLowerCase().includes(query) ||
      booking.pickupLocation?.locationName.toLowerCase().includes(query) ||
      booking.dropOffLocation?.locationName.toLowerCase().includes(query) ||
      booking.bookingID.toString().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage all your car rental bookings</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by car, location, or booking ID..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="BOOKED">Booked</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading bookings...</div>
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">Start your journey by booking your first car</p>
              <Button onClick={() => navigate("/browse-cars")}>Browse Available Cars</Button>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredBookings.length} of {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </div>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
              <Card key={booking.bookingID}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{booking.car.brand} {booking.car.model}</CardTitle>
                        <CardDescription>
                          {booking.bookingDateAndTime ? `Booked on ${formatDateTime(booking.bookingDateAndTime)}` : 'New Booking'}
                        </CardDescription>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Rental Period</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                        {booking.rentalDays && (
                          <p className="text-xs text-muted-foreground mt-1">{booking.rentalDays} days</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Locations</p>
                        <p className="text-sm text-muted-foreground">Pickup: {booking.pickupLocation?.locationName || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Return: {booking.dropOffLocation?.locationName || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Payment</p>
                        {booking.totalAmount ? (
                          <p className="text-sm font-semibold">{booking.currency || 'ZAR'} {booking.totalAmount.toFixed(2)}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Pending calculation</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Status: {booking.payment?.paymentStatus || 'Pending'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Booking ID: #{booking.bookingID}
                    </div>
                    <div className="flex gap-2">
                      {booking.bookingStatus === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelClick(booking)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(booking)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          </>
        )}

        {/* Action Card */}
        {bookings.length > 0 && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Ready for another adventure?</CardTitle>
              <CardDescription>Browse our fleet and book your next rental</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/browse-cars")}>Browse Available Cars</Button>
            </CardContent>
          </Card>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>Booking ID: #{selectedBooking.bookingID}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status */}
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.bookingStatus)}`}>
                    {selectedBooking.bookingStatus}
                  </span>
                </div>

                {/* Car Details */}
                <div>
                  <h3 className="font-semibold mb-2">Vehicle</h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <p className="text-lg font-medium">{selectedBooking.car.brand} {selectedBooking.car.model}</p>
                    {selectedBooking.car.year && <p className="text-sm text-muted-foreground">Year: {selectedBooking.car.year}</p>}
                    {selectedBooking.car.color && <p className="text-sm text-muted-foreground">Color: {selectedBooking.car.color}</p>}
                    {selectedBooking.car.licensePlate && <p className="text-sm text-muted-foreground">License Plate: {selectedBooking.car.licensePlate}</p>}
                  </div>
                </div>

                {/* Rental Period */}
                <div>
                  <h3 className="font-semibold mb-2">Rental Period</h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <p className="text-sm">Start: {formatDateTime(selectedBooking.startDate)}</p>
                    <p className="text-sm">End: {formatDateTime(selectedBooking.endDate)}</p>
                    {selectedBooking.rentalDays && (
                      <p className="text-sm font-medium">Duration: {selectedBooking.rentalDays} days</p>
                    )}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h3 className="font-semibold mb-2">Locations</h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <div>
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-sm text-muted-foreground">{selectedBooking.pickupLocation?.locationName || 'N/A'}</p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium">Drop-off Location</p>
                      <p className="text-sm text-muted-foreground">{selectedBooking.dropOffLocation?.locationName || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="font-semibold mb-2">Pricing Details</h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    {selectedBooking.subtotal && (
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{selectedBooking.currency || 'ZAR'} {selectedBooking.subtotal.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedBooking.taxAmount && (
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>{selectedBooking.currency || 'ZAR'} {selectedBooking.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedBooking.discountAmount && selectedBooking.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{selectedBooking.currency || 'ZAR'} {selectedBooking.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedBooking.totalAmount && (
                      <div className="flex justify-between font-semibold text-base pt-2 border-t">
                        <span>Total Amount</span>
                        <span>{selectedBooking.currency || 'ZAR'} {selectedBooking.totalAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <h3 className="font-semibold mb-2">Payment Status</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm">{selectedBooking.payment?.paymentStatus || 'Pending'}</p>
                  </div>
                </div>

                {/* Booking Date */}
                {selectedBooking.bookingDateAndTime && (
                  <div>
                    <h3 className="font-semibold mb-2">Booked On</h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm">{formatDateTime(selectedBooking.bookingDateAndTime)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cancel Booking Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle>Cancel Booking</CardTitle>
                    <CardDescription>This action cannot be undone</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to cancel this booking?
                </p>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <p className="font-medium">{selectedBooking.car.brand} {selectedBooking.car.model}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Booking ID: #{selectedBooking.bookingID}
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCancelModal(false)}
                    disabled={cancellingBooking !== null}
                  >
                    Keep Booking
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleCancelBooking}
                    disabled={cancellingBooking !== null}
                  >
                    {cancellingBooking === selectedBooking.bookingID ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Cancelling...
                      </>
                    ) : (
                      "Cancel Booking"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
