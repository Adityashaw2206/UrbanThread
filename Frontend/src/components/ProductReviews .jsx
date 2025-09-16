import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Product } from "../../../Backend/models/product.model";
const ProductReviews = ({ productId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim(); // ✅ backend URL from .env
  // 🔹 Fetch reviews
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/reviews/${productId}`);
      // console.log("Fetched Reviews:", data);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reviews");
    }
  };

  // 🔹 Submit review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) return alert("Please log in first");
    if (!productId) {
      toast.error("Product ID is missing. Cannot submit review.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/reviews/add`,
        { productId, rating, comment },
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success("Review submitted");
      console.log("Review submitted:", data);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to submit review");
    }
  };


  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  return (
    <div className="mt-10 border-t pt-5">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

      {/* ✅ Reviews List */}
      {(reviews?.length ?? 0) > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="p-3 mb-2 border rounded">
            <p className="font-semibold">{review.user?.name || "User"}</p>
            <p className="text-yellow-500">Rating: {"⭐".repeat(review.rating)}</p>
            <p>{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}

      {/* ✅ Add Review Form */}
      {user && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Leave a Review</h3>
          <div className="mb-3">
            <label className="block mb-1">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-2 rounded w-full"
            >
              <option value={0}>Select rating</option>
              <option value={1}>1 ⭐</option>
              <option value={2}>2 ⭐⭐</option>
              <option value={3}>3 ⭐⭐⭐</option>
              <option value={4}>4 ⭐⭐⭐⭐</option>
              <option value={5}>5 ⭐⭐⭐⭐⭐</option>
            </select>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="border p-2 w-full rounded mb-3"
          />
          <button
            onClick={submitReview}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
