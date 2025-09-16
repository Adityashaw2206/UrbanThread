import React, { useState, useContext } from "react";
import Title from "../../components/Title";
import CartTotal from "../../components/CartTotal";
import { ShopContext } from "../../context/ShopContext.jsx";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
const PlaceOrder = () => {
  // TODO: Replace the following mock data with actual data from your store or API
  // const cartData = [];
  // const currency = 'USD';
  // const shipping_charge = 0;
  const {
    userId,
    cartItems,
    backendUrl,
    token,
    setCartItems,
    currency,
    shipping_charge,
    products,
  } = useContext(ShopContext);
  const cartData = [];
  Object.entries(cartItems).forEach(([productId, sizesObj]) => {
    Object.entries(sizesObj).forEach(([size, qty]) => {
      const product = products.find((p) => String(p._id) === String(productId));
      if (product) {
        cartData.push({ ...product, size, quantity: qty });
      }
    });
  });
  const { navigate } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          orderItems.push({
            productId: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
      // Calculate total price
      const totalPrice =
        orderItems.reduce((acc, item) => {
          const product = products.find((p) => p._id === item.productId);
          return acc + (product ? product.price * item.quantity : 0);
        }, 0) + shipping_charge;
      const decoded = jwtDecode(token);
      // Get adminId from the first product in the cart
      const firstProduct = products.find(
        (p) => p._id === orderItems[0]?.productId
      );
      const adminId = firstProduct ? firstProduct.admin : undefined;
      let orderData = {
        userId: decoded._id,
        address: formData,
        items: orderItems,
        amount: totalPrice,
        adminId, // <-- add adminId here
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/orders/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            toast.success("Order placed successfully!");
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        case "razorpay": {
          orderData.paymentMethod = "Razorpay";
          break;
        }
        case "stripe": {
          orderData.paymentMethod = "Stripe";
          const responseStripe = await axios.post(
            backendUrl + "/api/orders/place/stripe", // make sure backend route matches (singular!)
            orderData,
            { headers: { token } }
          );

          if (responseStripe.data.success) {
            window.location.href = responseStripe.data.url; // Redirect to Stripe Checkout
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
          // break;
        }
        default: {
          orderData.paymentMethod = "COD";
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className=" flex flex-col lg:flex-row justify-between gap-5 sm:gap-0 sm:pt-14 min-h-[60vh]"
    >
      <div className="mr-10 flex flex-col gap-4 w-full sm:max-w-[400px]">
        <div className="text-3xl my-3">
          <Title text1={"Delivery"} text2={"Information"} />
        </div>
        <div className="gap-3 flex">
          <input
            required
            onChange={handleInputChange}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded w-full py-1.5 px-3.5"
            type="text"
            placeholder="First Name"
          />
          <input
            required
            onChange={handleInputChange}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded w-full py-1.5 px-3.5"
            type="text"
            placeholder="Last Name"
          />
        </div>

        <div className="flex">
          <input
            required
            onChange={handleInputChange}
            name="email"
            value={formData.email}
            className="border border-gray-300 rounded w-full py-1.5 px-3.5"
            type="email"
            placeholder="Email"
          />
        </div>

        <div className="flex">
          <input
            required
            onChange={handleInputChange}
            name="street"
            value={formData.street}
            className="border border-gray-300 rounded w-full py-1.5 px-3.5"
            type="text"
            placeholder="Street"
          />
        </div>
        <div className="gap-3 flex">
          <input
            required
            onChange={handleInputChange}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded w-full py-1.5 px-3.5"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={handleInputChange}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded w-full py-1.5 px-3.5"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="gap-3 flex">
          <input
            required
            onChange={handleInputChange}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded w-full py-1.5 px-3.5"
            type="number"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={handleInputChange}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded w-full py-1.5 px-3.5"
            type="text"
            placeholder="Country"
          />
        </div>
        <div className="gap-3 flex">
          <input
            required
            onChange={handleInputChange}
            name="phone"
            value={formData.phone}
            className="border border-gray-300 rounded w-full py-1.5 px-3.5"
            type="number"
            placeholder="Phone"
          />
        </div>
      </div>

      {/* ----------------right side------------ */}
      <div className="mt-8">
        <div className="text-2xl mt-8 min-w-80 justify-end">
          {/* <Title text1={'Order'} text2={'Summary'} /> */}
          <CartTotal
            cartData={cartData}
            currency={currency}
            shipping_charge={shipping_charge}
          />
        </div>
        <div className="text-2xl mt-12">
          <Title text1={"Payment"} text2={"Method"} />
          {/* payment section method */}
          <div className="flex gap-3 lg:flex-row">
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method == "razorpay" ? "bg-black" : " "
                }`}
              ></p>
              <img className="h-5 ms-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method == "stripe" ? "bg-black" : " "
                }`}
              ></p>
              <img className="h-5 ms-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method == "cod" ? "bg-black" : " "
                }`}
              ></p>
              <p className="font-medium text-sm text-gray-500 mx-4">
                Cash On Delivery
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end ml-auto">
          <button
            type="submit"
            className="w-10px mt-4 px-6 py-2 text-white bg-black border border-black rounded active:bg-gray-400  transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
