import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
// ✅ Create or Update Review (one review per user per product)
export const addOrUpdateReview = async (req, res) => {
  try {
    const userId = req.userId; // from JWT
    const { productId, rating, comment } = req.body;
    // console.log("Review POST:", { userId, productId, rating, comment });

    if (!productId || !rating) {
      console.error("Review error: Missing productId or rating", { userId, productId, rating, comment });
      return res.status(400).json({ success: false, message: "Product ID and rating are required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.error("Review error: Product not found", { productId });
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if user already reviewed
    let review = await Review.findOne({ user: userId, product: productId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment || review.comment;
      await review.save();
      return res.status(200).json({ success: true, message: "Review updated", review });
    } else {
      // Create new review
      review = new Review({
        user: userId,
        product: productId,
        rating,
        comment,
      });
      await review.save();
      return res.status(201).json({ success: true, message: "Review added", review });
    }
  } catch (error) {
    console.error("Review controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a review (Admin or User)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Only allow deleting if user owns the review or is admin (you can add role check later)
    if (review.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin: Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name price");
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
