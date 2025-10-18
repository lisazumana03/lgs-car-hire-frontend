import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Star, MessageSquare, User as UserIcon, Calendar } from "lucide-react";
import Header from "@/components/Header";
import api, { BookingDTO, CarDTO, bookingAPI, carAPI } from "@/services/api";

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

export default function Reviews() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [userBookings, setUserBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get<Review[]>("/review/all");
      // Sort by most recent first
      const sortedReviews = response.data.sort((a, b) =>
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

    try {
      setSubmitting(true);

      const selectedBooking = userBookings.find(b => b.bookingID.toString() === selectedBookingId);
      if (!selectedBooking) {
        toast.error("Invalid booking selected");
        return;
      }

      const reviewData = {
        car: {
          carID: selectedBooking.car.carID,
        },
        user: {
          userId: user.id,
        },
        booking: {
          bookingID: selectedBooking.bookingID,
        },
        rating: rating,
        title: title,
        comment: comment,
        isVerified: false,
      };

      await api.post("/review/create", reviewData);

      toast.success("Review submitted successfully!");

      // Reset form
      setSelectedBookingId("");
      setRating(0);
      setTitle("");
      setComment("");
      setShowForm(false);

      // Refresh reviews
      fetchReviews();
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Customer Reviews</h1>
                <p className="text-muted-foreground">See what our customers are saying</p>
              </div>
              {user && (
                <Button onClick={() => setShowForm(!showForm)}>
                  {showForm ? "Cancel" : "Write a Review"}
                </Button>
              )}
            </div>
          </div>

          {/* Review Form */}
          {showForm && user && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>Share your experience with your rental</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking">Select Booking *</Label>
                    <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a booking to review" />
                      </SelectTrigger>
                      <SelectContent>
                        {userBookings.map((booking) => (
                          <SelectItem key={booking.bookingID} value={booking.bookingID.toString()}>
                            {booking.car.brand} {booking.car.model} - Booking #{booking.bookingID}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Rating *</Label>
                    {renderStars(rating, true, setRating)}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Summarize your experience"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about your experience..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Review"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your experience!
                  </p>
                  {user && (
                    <Button onClick={() => setShowForm(true)}>Write a Review</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.reviewID}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <UserIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">
                              {review.user.name || `User ${review.user.userId}`}
                            </h3>
                            {review.isVerified && (
                              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400 px-2 py-1 rounded">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>

                    {review.car && (
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">
                          Reviewed: <span className="font-medium text-foreground">
                            {review.car.brand} {review.car.model}
                          </span>
                        </p>
                      </div>
                    )}

                    {review.title && (
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                    )}

                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
