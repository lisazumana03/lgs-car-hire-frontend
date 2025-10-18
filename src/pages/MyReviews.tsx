import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Star, MessageSquare, Calendar } from "lucide-react";
import Header from "@/components/Header";
import api, { BookingDTO, bookingAPI } from "@/services/api";

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

export default function MyReviews() {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [userBookings, setUserBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchReviews = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await api.get<Review[]>("/review/all");
      // Filter only user's reviews
      const userReviews = response.data.filter(r => r.user.userId === user.id);
      // Sort by most recent first
      const sortedReviews = userReviews.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReviews(sortedReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    if (!user) return;

    try {
      const allBookings = await bookingAPI.getAll();
      const userBookings = allBookings.filter(b => {
        const bookingUserId = b.user?.userId || b.user?.id;
        return b.user && bookingUserId === user.id;
      });
      setUserBookings(userBookings);
    } catch (error) {
      console.error("Failed to fetch user bookings:", error);
    }
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

    const selectedBooking = userBookings.find(b => b.bookingID.toString() === selectedBookingId);
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

      console.log("=== REVIEW SUBMISSION DEBUG ===");
      console.log("Submitting review data:", reviewData);
      const token = localStorage.getItem("token");
      console.log("Current token exists:", !!token);
      console.log("Token preview:", token?.substring(0, 30) + "...");
      console.log("Request URL:", "http://localhost:3045/review/create");
      console.log("Request body:", JSON.stringify(reviewData));

      // Try without the default api instance to bypass token
      const response = await fetch("http://localhost:3045/review/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit", // Don't send cookies or credentials
        body: JSON.stringify(reviewData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Review created:", result);
      toast.success("Review submitted successfully!");

      // Refresh reviews
      await fetchReviews();

      // Reset form
      setShowForm(false);
      setSelectedBookingId("");
      setRating(0);
      setTitle("");
      setComment("");
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      if (error.response?.status === 403) {
        toast.error("Access denied. Please try logging out and logging back in.");
      } else {
        toast.error(error.response?.data?.message || "Failed to submit review");
      }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
            <p className="text-muted-foreground">Manage your rental reviews</p>
          </div>

          {/* Write Review Button */}
          <div className="mb-6">
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Write a Review"}
            </Button>
          </div>

          {/* Review Submission Form */}
          {showForm && (
            <Card className="mb-8 border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Submit a Review</CardTitle>
                <CardDescription>Share your experience with a rental</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label htmlFor="booking">Select Booking</Label>
                    <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a booking to review" />
                      </SelectTrigger>
                      <SelectContent>
                        {userBookings.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">No bookings available</div>
                        ) : (
                          userBookings.map((booking) => (
                            <SelectItem key={booking.bookingID} value={booking.bookingID.toString()}>
                              {booking.car.brand} {booking.car.model} - {formatDate(booking.startDate)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Rating</Label>
                    <div className="mt-2">
                      {renderStars(rating, true)}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">Title (Optional)</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your review a title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="comment">Comment (Optional)</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Reviews</CardTitle>
              <CardDescription>Reviews you've written for your rentals</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading reviews...</div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't written any reviews yet.</p>
                  <p className="text-sm text-muted-foreground">
                    Share your experience with other customers by writing a review.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.reviewID}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            {review.isVerified && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400">
                                Verified
                              </span>
                            )}
                          </div>
                          {review.title && (
                            <h3 className="font-semibold mb-1">{review.title}</h3>
                          )}
                          <p className="text-sm text-muted-foreground mb-2">
                            {review.car.brand} {review.car.model}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>

                      {review.comment && (
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      )}
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
