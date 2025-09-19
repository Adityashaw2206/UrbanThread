import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import Title from "../../components/Title";
import {
  Package,
  Truck,
  XCircle,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react";

const Orders = () => {
  const { backendUrl, token, shipping_charge } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // for modal

  // inside Orders component

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/api/orders/delete/${orderId}`,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Order deleted successfully");
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/orders/userOrders", {
          headers: { token },
        });
        if (res.data.success) {
          setOrders(Array.isArray(res.data.data) ? res.data.data : []);
        } else {
          setOrders([]);
          toast.error(res.data.message);
        }
      } catch (err) {
        console.log(err);
        // toast.error("Failed to fetch orders");
      }
    };

    if (token) fetchOrders();
  }, [backendUrl, token]);

  // status color mapping

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const res = await axios.get(`${backendUrl}/api/orders/list`, { headers: { Authorization: `Bearer ${token}` } })
  //       if (res.data.success) {
  //         setOrders(Array.isArray(res.data.data) ? res.data.data : []);
  //       } else {
  //         setOrders([]);
  //         toast.error(res.data.message);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       // toast.error("Failed to fetch orders");
  //     }
  //   };

  //   let interval;
  //   if (token) {
  //     fetchOrders(); // fetch immediately on mount
  //     // interval = setInterval(fetchOrders, 5000); // fetch every 5 sec
  //   }

  //   return () => clearInterval(interval); // cleanup
  // }, [backendUrl, token]);

  const statusClasses = {
    Delivered: "bg-green-100 text-green-700 border-green-300",
    Shipped: "bg-blue-100 text-blue-700 border-blue-300",
    Cancelled: "bg-red-100 text-red-700 border-red-300",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  const statusIcons = {
    Delivered: <Package size={16} />,
    Shipped: <Truck size={16} />,
    Cancelled: <XCircle size={16} />,
    Pending: <Clock size={16} />,
  };

  // tracking steps
  const steps = [
    { label: "Order Placed", icon: <Package /> },
    { label: "Shipped", icon: <Truck /> },
    { label: "Out for Delivery", icon: <MapPin /> },
    { label: "Delivered", icon: <CheckCircle /> },
  ];

  // find current step index
  const getStepIndex = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Shipped":
        return 1;
      case "Out for Delivery":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-[80vh] p-6 bg-gray-50 text-2xl">
      <Title text1={"My"} text2={"Orders"} />

      {Array.isArray(orders) && orders.length === 0 ? (
        <p className="text-gray-500 mt-6 text-center text-lg">
          You don’t have any orders yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="border rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Order ID:</span> {order._id}
                </p>
                <span
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium border rounded-full ${
                    statusClasses[order.status] || statusClasses["Pending"]
                  }`}
                >
                  {statusIcons[order.status] || statusIcons["Pending"]}
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center gap-4 border-b pb-3"
                  >
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md border"
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        {item.price * item.quantity} {order.currency || "$"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="flex flex-col">
                <div className="ml-auto mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <p className="font-medium">Shipping:</p>
                    <p>
                      {(order.shipping_charge !== undefined
                        ? order.shipping_charge
                        : shipping_charge) +
                        " " +
                        (order.currency || "$")}
                    </p>
                  </div>
                  <div className="flex justify-between text-base font-semibold">
                    <p>Total:</p>
                    <p>
                      {order.amount} {order.currency || "$"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="ml-0 mt-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.address.phone}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.state} - {order.address.zipcode},{" "}
                    {order.address.country}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end mt-5 gap-3">
                {/* <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100">
                  Invoice
                </button> */}
                <button
                    onClick={() => handleDelete(order._id)}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Track Order</h2>

            {/* Stepper */}
            <div className="flex flex-col gap-6">
              {steps.map((step, i) => {
                const currentStep = getStepIndex(selectedOrder.status);
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                        i <= currentStep
                          ? "bg-green-500 text-white border-green-500"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        i <= currentStep ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Close Btn */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
