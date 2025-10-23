import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllTickects,
  updateSupportTicket as updateReview,
  deleteSupportTicket as deleteReview,
} from "../../../services/reviewService";
import { getAllCars } from "../../../services/carService";

function ReviewEditList() {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    comment: "",
    rating: 0,
    carID: "",
  });
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await getAllTickects();
      setReviews(response.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all cars for dropdown
  const fetchCars = async () => {
    try {
      const res = await getAllCars();
      setCars(res.data || []);
    } catch (err) {
      console.error("Error loading cars:", err);
      setCars([]);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchCars();
  }, []);

  const handleEditClick = (review) => {
    setEditingId(review.reviewID);
    setEditForm({
      fullName: review.fullName,
      comment: review.comment,
      rating: review.rating,
      carID: review.car?.carID || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        reviewID: editingId,
        fullName: editForm.fullName,
        comment: editForm.comment,
        rating: parseInt(editForm.rating) || 0,
        car: { carID: parseInt(editForm.carID) },
      };
      await updateReview(payload);
      setEditingId(null);
      fetchReviews();
      alert("Review updated successfully!");
    } catch (err) {
      console.error("Error updating review:", err);
      alert("Failed to update review.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id);
        fetchReviews();
        alert("Review deleted successfully!");
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("Failed to delete review.");
      }
    }
  };

  return (
    <div
      className="main-content"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(120deg, #232526 0%, #414345 100%)",
      }}
    >
      <div
        className="dashboard-container"
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "rgba(30, 41, 59, 0.98)",
          borderRadius: "18px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          padding: "2.5rem",
          marginTop: "2rem",
        }}
      >
        <h1
          style={{
            marginBottom: "30px",
            color: "#fff",
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          Edit or Delete Reviews
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 18px",
              background: "linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Back
          </button>
          <button
            onClick={fetchReviews}
            style={{
              padding: "8px 18px",
              background: "linear-gradient(90deg, #F87171 0%, #FBBF24 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>

        {loading && (
          <p style={{ color: "#fff", textAlign: "center" }}>
            Loading reviews...
          </p>
        )}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "30px",
            marginTop: "2rem",
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.reviewID}
              style={{
                background: "linear-gradient(120deg, #e0e7ef 0%, #f8fafc 100%)",
                borderRadius: "22px",
                boxShadow: "0 8px 32px rgba(30,41,59,0.18)",
                maxWidth: "600px",
                overflow: "hidden",
                margin: "0 auto",
                marginBottom: "40px",
                border: "1px solid #e5e7eb",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
                  padding: "26px 36px",
                  display: "flex",
                  alignItems: "center",
                  borderTopLeftRadius: "22px",
                  borderTopRightRadius: "22px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#fff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "2.2rem",
                    marginRight: "26px",
                    boxShadow: "0 2px 8px rgba(59,130,246,0.15)",
                  }}
                >
                  {review.fullName ? review.fullName.charAt(0) : "?"}
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.35rem",
                      color: "#fff",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {review.fullName || "Anonymous"}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "1rem",
                      color: "#e0e7ef",
                      marginTop: "2px",
                    }}
                  >
                    Review ID: {review.reviewID}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      background: "linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)",
                      borderRadius: "10px",
                      padding: "8px 20px",
                      fontSize: "1.08rem",
                      marginLeft: "16px",
                      boxShadow: "0 2px 8px rgba(251,191,36,0.12)",
                    }}
                  >
                    <span style={{ color: "#FFD700", fontWeight: "bold" }}>
                      {Array(review.rating).fill("★").join("")}
                    </span>{" "}
                    <span style={{ fontWeight: "normal", color: "#334155" }}>
                      ({review.rating}/5)
                    </span>
                  </span>
                </div>
              </div>

              {/* Car Info */}
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "22px 36px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#2563eb",
                    fontSize: "1.12rem",
                  }}
                >
                  Car:{" "}
                </span>
                <span
                  style={{
                    color: "#334155",
                    fontSize: "1.12rem",
                    fontWeight: "500",
                  }}
                >
                  {(review.car && ((review.car.brand || "") + " " + (review.car.model || ""))) || "N/A"}
                </span>
                <span
                  style={{
                    marginLeft: "18px",
                    color: "#2563eb",
                    fontWeight: "bold",
                    fontSize: "1.12rem",
                  }}
                >
                  Car ID:{" "}
                  <span style={{ color: "#334155", fontWeight: "500" }}>
                    {review.car?.carID || "N/A"}
                  </span>
                </span>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: "28px 36px",
                  background: "#fff",
                  borderBottomLeftRadius: "22px",
                  borderBottomRightRadius: "22px",
                }}
              >
                {editingId === review.reviewID ? (
                  <form onSubmit={handleEditSubmit}>
                    <label
                      style={{
                        display: "block",
                        fontWeight: "600",
                        color: "#2563eb",
                        marginBottom: "6px",
                      }}
                    >
                      Select Car
                    </label>
                    <select
                      name="carID"
                      value={editForm.carID}
                      onChange={handleEditChange}
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginBottom: "8px",
                      }}
                    >
                      <option value="" disabled>
                        Select a car
                      </option>
                      {cars.map((car) => (
                        <option key={car.carID || car.id} value={car.carID || car.id}>
                          {car.brand} {car.model} ({car.year})
                        </option>
                      ))}
                    </select>

                    <label
                      style={{
                        display: "block",
                        fontWeight: "600",
                        color: "#2563eb",
                        marginBottom: "6px",
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleEditChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginBottom: "8px",
                      }}
                      required
                    />

                    <label
                      style={{
                        display: "block",
                        fontWeight: "600",
                        color: "#2563eb",
                        marginBottom: "6px",
                      }}
                    >
                      Review
                    </label>
                    <textarea
                      name="comment"
                      value={editForm.comment}
                      onChange={handleEditChange}
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginBottom: "8px",
                      }}
                      required
                    />

                    <label
                      style={{
                        display: "block",
                        fontWeight: "600",
                        color: "#2563eb",
                        marginBottom: "6px",
                      }}
                    >
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={editForm.rating}
                      onChange={handleEditChange}
                      min="1"
                      max="5"
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                      required
                    />

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                        marginTop: "12px",
                      }}
                    >
                      <button
                        type="submit"
                        style={{
                          background: "#4ade80",
                          color: "white",
                          padding: "8px 18px",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "#aaa",
                          color: "white",
                          padding: "8px 18px",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#2563eb",
                        fontSize: "1.12rem",
                      }}
                    >
                      Review:{" "}
                    </span>
                    <p
                      style={{
                        color: "#334155",
                        fontSize: "1.12rem",
                        fontWeight: "500",
                        marginTop: "0.5rem",
                      }}
                    >
                      {review.comment}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "18px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        style={{
                          background: "#007bff",
                          color: "white",
                          padding: "8px 18px",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => handleEditClick(review)}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          background: "#dc2626",
                          color: "white",
                          padding: "8px 18px",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(review.reviewID)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewEditList;
