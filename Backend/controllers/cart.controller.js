import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/ApiErrors.js";
import { toast } from "react-toastify";
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;
    const userData = await User.findById(userId);
    let cartData = userData.cartData || {};
    if (!itemId || !size) {
      return res.status(400).json({ message: "Item ID and size are required" });
    }
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    const response = await User.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true }
    );
    // console.log("This is the " + response);

    // return new ApiResponse(200, cartData, "Item added to cart successfully");
    res
      .status(200)
      .json(new ApiResponse(200, cartData, "item added to the cart"));
    // toast.success(response.data.message || "Item added to cart!");
  } catch (error) {
    console.error("Error adding item to cart:", error);
    // res.status(500).json({ message: error.message });
    throw new ApiError(error.status || 500, error.message);
    // toast.error("Failed to add item to cart");
  }
};

const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;
    // if (!itemId || !size || quantity == null) {
    //   return res.status(400).json({ message: "Item ID, size and quantity are required" });
    // }
    const userData = await User.findById(userId);
    let cartData = userData.cartData || {};
    // if (!cartData[itemId]) cartData[itemId] = {};
    // cartData[itemId][size] = quantity;
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId][size] = quantity;
    }
    const response = await User.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, response.cartData, "Cart updated successfully")
      );
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUserCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    // console.log("getUserCart hit ✅, userId:", req.userId); // <-- debug log
    // const { userId } = req.body;
    const userData = await User.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};

    return res.status(200).json({
      success: true,
      data: cartData,
      message: "Cart retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    throw new ApiError(error.status || 500, error.message);
  }
};

export { addToCart, getUserCart, updateCart };
