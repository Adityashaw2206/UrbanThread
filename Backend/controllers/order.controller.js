import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiErrors.js";
import { Product } from "../models/product.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { sendMail } from "../utils/sendMail.js";
dotenv.config();
const currency = "usd"; // Change to 'inr' if needed
const shipping_charges = 10;
// console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY not found in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    // Copy product details to each item
    for (let i = 0; i < items.length; i++) {
      const product = await Product.findById(items[i].productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found for item ${i + 1}`,
        });
      }
      items[i].image = product.image;
      items[i].description = product.description;
      items[i].price = product.price;
      items[i].name = product.name;
    }
    const orderData = {
      userId: req.userId,
      // adminId, // 👈 assign adminId here
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    //sending mail to user for successful order placement
    const user = await User.findById(userId);
    if (user?.email) {
      await sendMail(
        user.email,
        "Order Placed Successfully",
        `<h3>Hi ${user.name || "User"},</h3>
     <p>Your order <b>${
       newOrder._id
     }</b> has been placed successfully with Cash on Delivery. 😁😁😁</p>
     <p>Amount: $${amount}</p>
     <p>We’ll notify you when it’s confirmed.</p>`
      );
    }

    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res
      .status(201)
      .json(new ApiResponse(201, null, "Order placed successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const { origin } = req.headers;
    const { userId, items, amount, address } = req.body;
    for (let i = 0; i < items.length; i++) {
      const product = await Product.findById(items[i].productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found for item ${i + 1}`,
        });
      }
      items[i].image = product.image;
      items[i].description = product.description;
      items[i].price = product.price;
      items[i].name = product.name;
    }
    const orderData = {
      userId: req.userId,
      // adminId, // 👈 assign adminId here
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const user = await User.findById(userId);
if (user?.email) {
  await sendMail(
    user.email,
    "Order Initiated with Stripe",
    `<h3>Hi ${user.name || "User"},</h3>
     <p>Your order <b>${newOrder._id}</b> has been created. Please complete your payment via Stripe.</p>
     <p>Total Amount: $${amount}</p>`
  );
}

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          // images: [item.image]
        },
        unit_amount: item.price * 100, // amount in cents
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Shipping Charge",
          // images: [item.image]
        },
        unit_amount: shipping_charges * 100, // amount in cents
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      // success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      // cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      success_url: `${process.env.BACKEND_URL}/api/orders/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.BACKEND_URL}/api/orders/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
      payment_method_types: ["card"],
      client_reference_id: req.userId,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// const verifyStripe = async(req,res) => {
//   const {orderId, success, userId} = req.query;
//   try {
//     if(success === 'true'){
//       await Order.findByIdAndUpdate(orderId,{payment: true});
//       await User.findByIdAndUpdate(userId, { cartData: {} });
//       // res.redirect(`${process.env.FRONTEND_URL}/orders`);
//       // toast.success("Payment successful");
//       res.status(200).json({success: true, message: "Payment successful"});
//     }else{
//       await Order.findByIdAndDelete(orderId);
//       // res.redirect(`${process.env.FRONTEND_URL}/cart`);
//       // toast.error("Payment failed, please try again");
//       res.success(200).json({success: false, message: "Payment failed, please try again"});
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(new ApiResponse(500, null, error.message));
//   }
// }

const verifyStripe = async (req, res) => {
  console.log("VerifyStripe called:", req.query);
  const { orderId, success } = req.query;
  try {
    if (success === "true") {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { payment: true, status: "confirmed" },
        { new: true }
      );

      // Clear user cart
      if (updatedOrder?.userId) {
        await User.findByIdAndUpdate(updatedOrder.userId, { cartData: {} });
         const user = await User.findById(updatedOrder.userId);
        if (user?.email) {
          await sendMail(
            user.email,
            "Payment Successful",
            `<h3>Hi ${user.name || "User"},</h3>
             <p>Your payment for order <b>${updatedOrder._id}</b> was successful.</p>
             <p>We will process your order soon.</p>`
          );
        }
      }



      // return res.status(200).json({
      //   success: true,
      //   message: "Payment successful",
      //   order: updatedOrder,
      // });
      return res.redirect(`${process.env.FRONTEND_URL}/api/user/orders`);
    } else {
      // Instead of deleting, mark as cancelled (better tracking)
      await Order.findByIdAndUpdate(orderId, { status: "cancelled" });

      const order = await Order.findById(orderId);
      const user = await User.findById(order?.userId);

      // 📩 Send failure email
      if (user?.email) {
        await sendMail(
          user.email,
          "Payment Failed",
          `<h3>Hi ${user.name || "User"},</h3>
           <p>Your payment for order <b>${orderId}</b> failed. Please try again.</p>`
        );
      }
      // return res.status(200).json({
      //   success: false,
      //   message: "Payment failed, please try again",
      // });
      return res.redirect(`${process.env.FRONTEND_URL}/api/user/cart`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const placeOrderRazorpay = async (req, res) => {};

const allOrder = async (req, res) => {
  console.log("allOrder endpoint hit");

  try {
    const orders = await Order.find({}).sort({ date: -1 });
    // const orders = await Order.find({ adminId: req.adminId }).sort({
    //   date: -1,
    // });

    // console.log("Fetched orders:", orders);

    if (!orders || orders.length === 0) {
      console.log("Responding with 404");
      return res.status(404).json({
        success: false,
        data: [],
        message: "No orders found",
      });
    }

    // console.log("Responding with 200");
    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders fetched successfully",
    });
  } catch (error) {
    console.error("Error inside allOrder:", error.message);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
    return;
  }
};

const userOrders = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "userId is required"));
  }

  try {
    const orders = await Order.find({ userId }).sort({ date: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json(new ApiResponse(404, [], "No orders found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders fetched successfully"));
  } catch (error) {
    console.error("Error inside userOrders:", error.message);
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// const userOrders = async (req, res) => {
//   const userId = req.userId;
//   if (!userId) {
//     return res.status(400).json({ message: "userId is required" });
//   }
//   try {
//     // const { userId } = req.userId;
//     const orders = await Order.find({ userId }).sort({ date: -1 });
//     if (!orders) {
//       throw new ApiError(404, "No orders found");
//     }
//     res
//       .status(200)
//       .json(new ApiResponse(200, orders, "Orders fetched successfully"));
//   } catch (error) {
//     console.log(error);
//     throw new ApiError(500, error.message);
//   }
// };

const updateStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({
      success: false,
      message: "Order ID and status are required",
    });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

     // 📩 Send status update email
    if (order?.userId) {
      const user = await User.findById(order.userId);
      if (user?.email) {
        await sendMail(
          user.email,
          "Order Status Updated",
          `<h3>Hi ${user.name || "User"},</h3>
           <p>Your order <b>${order._id}</b> status has been updated to: <b>${status}</b>.</p>`
        );
      }
    }
    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.params;

    const deleted = await Order.findOneAndDelete({
      _id: orderId,
      userId: req.userId, // ensure user can only delete their own
    });

    const user = await User.findById(req.userId);
    if (user?.email) {
      await sendMail(
        user.email,
        "Order Deleted",
        `
          <h2>Hello ${user.name || "User"},</h2>
          <p>Your order <b>${deleted._id}</b> has been <b>deleted</b> successfully. 😔😔</p>
          <p>If this wasn't you, please contact our support team.</p>
          <br/>
          <p>Thank you,<br/>MyShop Team</p>
        `
        // user.email,
        // "Order deleted successfully",
        // `<h3>Hi ${user.name || "User"},</h3>
        //  <p>Your order <b>${newOrder._id}</b> has been deleted</p>`
      );
    }
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrder,
  userOrders,
  updateStatus,
  verifyStripe,
  deleteOrder,
};
