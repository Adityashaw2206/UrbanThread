import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { assets } from "../assets/assets.js";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const adminToken = localStorage.getItem("token");

  // Fetch all orders
  const fetchAllOrders = async () => {
    console.log("Fetching orders...");
    console.log("Admin Token:", adminToken);
    if (!adminToken) return;
    try {
      const response = await axios.get(`${backendUrl}/api/orders/list`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      // console.log("Orders response:", response.data);
      
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/orders/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders(); // refresh list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAllOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 empty dependency array

  return (
    <div className="flex flex-col md:ml-40 p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4"
            >
              {/* Order icon */}
              <div className="w-16 h-16 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={order.items[0]?.image || assets.parcel_icon}
                  alt={order.items[0]?.name || "Product"}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Order Details */}
              <div className="flex-1">
                <p className="text-xl text-black font-semibold">
                  Order ID: <span className="text-gray-600">{order._id}</span>
                </p>
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {order.address.firstName || "N/A"} {order.address.lastName || ""}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {order.address.phone || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {order.address
                    ? `${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zipcode}, ${order.address.country}`
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.date).toLocaleString()}
                </p>
                <p>
                  payment Method: <span className="font-medium">{order.paymentMethod}</span>
                </p>
                <p>
                  Payment Status:{" "}
                  <span className="font-medium">
                    {order.payment ? "Paid" : "Pending"}
                  </span>
                </p>
                {/* Items */}
                <div className="mt-2">
                  <p className="font-medium text-xl text-black">Items:</p>
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-700">
                      • {item.name} x {item.quantity} ({item.size})
                    </p>
                  ))}
                </div>

                {/* Total */}
                <p className="text-xl text-black mt-2 font-semibold">
                  Total: ${order.amount || 0}
                </p>
              </div>

              {/* Status Selector */}
              <div className=" justify-between">
                <label className="font-medium mb-2">Status: </label>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="border p-2 rounded-lg"
                >
                  <option value="Order Placed">Order Placed</option>
                  {/* <option value="Processing">Processing</option> */}
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  {/* <option value="Cancelled">Cancelled</option> */}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Order;
