// routes/reviewRoutes.js
import express from "express";
import { Review } from "../models/review.model.js";
import authMiddleware from "../middleware/authMiddleware.js";
import mongoose from "mongoose";
import { addOrUpdateReview } from "../controllers/review.controller.js";
import { getProductReviews } from "../controllers/review.controller.js";
const reviewRouter = express.Router();

// ➕ Add a Review
reviewRouter.post("/add", authMiddleware, addOrUpdateReview);

// reviewRouter.post("/", async (req, res) => {
//   try {
//     const { productId, user, rating, comment } = req.body;

//     if (!productId || !user || !rating || !comment) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const review = new Review({ product, user, rating, comment });
//     await review.save();

//     res.status(201).json({
//       success: true,
//       review,
//     });
//   } catch (error) {
//     console.error("Error submitting review:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });


// reviewRouter.post("/add", authMiddleware, async (req, res) => {
//   try {
//     const { productId, rating, comment } = req.body;

//     if (!productId || !rating) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Product ID and rating are required" });
//     }

//     const review = await Review.create({
//       product : productId,
//       user: req.user.id,
//       rating,
//       comment,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Review added successfully",
//       review,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// 📥 Get Reviews for a Product
reviewRouter.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    // console.log("Fetching reviews for productId:", productId);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name email"
    );

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// reviewRouter.get("/:productId", authMiddleware, getProductReviews);

export default reviewRouter;
// ➖ Delete a Review