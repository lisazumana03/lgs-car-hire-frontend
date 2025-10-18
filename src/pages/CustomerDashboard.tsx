import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { bookingAPI, invoiceAPI, BookingDTO, InvoiceDTO } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Calendar, Car, MapPin, CreditCard, Receipt, Star, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import api from "@/services/api";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Review {
  reviewID: number;
  car: {
    carID: number;
    brand?: string;
    model?: string;
  };
  user: {
    userId: number;
    name?: string;
  };
  booking?: {
    bookingID: number;
  };
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Fetch all bookings and filter for current user
        const allBookings = await bookingAPI.getAll();

        const userBookings = allBookings.filter(b => {
          // Backend returns userId, not id
          const bookingUserId = b.user?.userId || b.user?.id;
          return b.user && bookingUserId === user.id;
        });

        // Sort by booking date (most recent first) and take top 5
        const recentBookings = userBookings
          .sort((a, b) => new Date(b.bookingDateAndTime).getTime() - new Date(a.bookingDateAndTime).getTime())
          .slice(0, 5);

        setBookings(recentBookings);

        // Fetch user's invoices
        try {
          const userInvoices = await invoiceAPI.getByUserId(user.id);
          console.log("Fetched invoices for user:", user.id, "Count:", userInvoices.length);
          console.log("Invoices data:", userInvoices);
          setInvoices(userInvoices);
        } catch (invoiceError) {
          console.error("Failed to fetch invoices:", invoiceError);
          setInvoices([]);
        }

        // Fetch user's reviews
        try {
          const allReviews = await api.get<Review[]>("/review/all");
          const userReviews = allReviews.data.filter(r => r.user.userId === user.id);
          const sortedReviews = userReviews.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setReviews(sortedReviews);
        } catch (reviewError) {
          console.error("Failed to fetch reviews:", reviewError);
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!selectedBookingId) {
      toast.error("Please select a booking");
      return;
    }

    const selectedBooking = bookings.find(b => b.bookingID.toString() === selectedBookingId);
    if (!selectedBooking) {
      toast.error("Invalid booking selected");
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        car: { carID: selectedBooking.car.carID },
        user: { userId: user.id },
        booking: { bookingID: selectedBooking.bookingID },
        rating: rating,
        title: title,
        comment: comment,
        isVerified: false,
      };

      await api.post("/review/create", reviewData);
      toast.success("Review submitted successfully!");

      // Refresh reviews
      const allReviews = await api.get<Review[]>("/review/all");
      const userReviews = allReviews.data.filter(r => r.user.userId === user.id);
      const sortedReviews = userReviews.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReviews(sortedReviews);

      // Reset form
      setShowReviewForm(false);
      setSelectedBookingId("");
      setRating(0);
      setTitle("");
      setComment("");
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= count
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">Customer Dashboard</p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View your current and past bookings</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <Button className="w-full" onClick={() => navigate("/my-bookings")}>View Bookings</Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Browse Cars</CardTitle>
              <CardDescription>Find your perfect vehicle</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <Button className="w-full" onClick={() => navigate("/browse-cars")}>Browse Fleet</Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View your invoices and receipts</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <div className="mb-3">
                <div className="text-2xl font-bold">{invoices.length}</div>
                <p className="text-xs text-muted-foreground">Total invoices</p>
              </div>
              <Button className="w-full" variant="outline" onClick={() => navigate("/invoices")}>
                View Invoices
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
              <CardDescription>View and write reviews</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <div className="mb-3">
                <div className="text-2xl font-bold">{reviews.length}</div>
                <p className="text-xs text-muted-foreground">Reviews written</p>
              </div>
              <Button className="w-full" variant="outline" onClick={() => navigate("/my-reviews")}>
                Manage Reviews
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest bookings and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading activity...</div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No recent activity to display.</p>
                <Button onClick={() => navigate("/cars")}>Browse Cars</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingID}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{booking.car.brand} {booking.car.model}</h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.bookingDateAndTime ? `Booked on ${formatDateTime(booking.bookingDateAndTime)}` : 'New Booking'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Rental Period</p>
                          <p className="font-medium">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </p>
                          {booking.rentalDays && (
                            <p className="text-xs text-muted-foreground">{booking.rentalDays} days</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Locations</p>
                          <p className="font-medium">{booking.pickupLocation?.locationName || 'N/A'}</p>
                          {booking.pickupLocation?.locationName !== booking.dropOffLocation?.locationName && (
                            <p className="text-xs text-muted-foreground">→ {booking.dropOffLocation?.locationName || 'N/A'}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          {booking.totalAmount ? (
                            <p className="font-medium">{booking.currency || 'ZAR'} {booking.totalAmount.toFixed(2)}</p>
                          ) : (
                            <p className="font-medium text-muted-foreground">Pending</p>
                          )}
                          <p className="text-xs text-muted-foreground">Payment: {booking.payment?.paymentStatus || 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Your latest invoices and receipts</CardDescription>
              </div>
              {invoices.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => navigate("/invoices")}>
                  View All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading invoices...</div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No invoices available yet.</p>
                <p className="text-sm text-muted-foreground">Invoices will appear here after you complete a booking.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice) => (
                  <div
                    key={invoice.invoiceID}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate("/invoices")}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Receipt className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Invoice #{invoice.invoiceID}</h3>
                          <p className="text-sm text-muted-foreground">{invoice.carModel}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status.toUpperCase() === "PAID"
                          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
                          : invoice.status.toUpperCase() === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
                      }`}>
                        {invoice.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Issue Date</p>
                          <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="font-bold text-lg">R {invoice.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
