import { toast } from "react-toastify";
// import { products } from "../assets/assets";
import { ShopContext } from "./ShopContext.jsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContextProvider = (props) => {
  const currency = "$";
  const shipping_charge = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
  //   console.log("🧪 Backend URL from env:", backendUrl);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [currentUser, setCurrentUser] = useState(null);

  const fetchUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get(backendUrl + "/api/user/profile", {
         headers: { token },
      });
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    // console.log("Token in localStorage:", storedToken); // Debug log
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select the size");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }
    setCartItems(cartData);
    if (token) {
      try {
        // console.log("Token being sent:", token);
        const response = await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token: token } }
        );
        toast.success(response.data.message || "Item added to cart!");
      } catch (error) {
        console.log("Error response from backend:", error); // Debug log
        toast.error("Failed to add item to cart");
      }
    }
  };

  const updateCart = async (itemId, size, quantity) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/update",
        { itemId, size, quantity },
        { headers: { token } }
      );
      // Only update UI if backend succeeds
      setCartItems(response.data.data);
      // toast.success(response.data.message || "Cart updated!");
    } catch (error) {
      console.log("Error response from backend:", error); // Debug log
      toast.error("Failed to update cart");
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    Object.values(cartItems).forEach((sizesObj) => {
      Object.values(sizesObj).forEach((qty) => {
        totalCount += qty;
      });
    });
    return totalCount;
  };

  const syncCartWithDB = async (itemId, size, quantity) => {
    if (!token) return; // only sync if logged in
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/update",
        { itemId, size, quantity },
        { headers: { token } }
      );
      setCartItems(response.data.data);
      // toast.success(response.data.message || "Cart updated!");
    } catch (error) {
      console.error("Error syncing cart:", error);
      toast.error("Failed to sync cart with server");
    }
  };

  const removeFromCart = async (itemId, size) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      // Remove the size entry
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    setCartItems(cartData);
    try {
      await axios.post(
        backendUrl + "/api/cart/update",
        { itemId, size, quantity: 0 }, // sending 0 quantity means "remove"
        { headers: { token } }
      );
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error syncing remove:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const increaseQuantity = (itemId, size) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      cartData[itemId][size] += 1;
    }
    setCartItems(cartData);
    syncCartWithDB(itemId, size, cartData[itemId][size]);
  };

  const decreaseQuantity = (itemId, size) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      cartData[itemId][size] -= 1;
      if (cartData[itemId][size] <= 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    syncCartWithDB(itemId, size, cartData[itemId]?.[size] || 0);
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      // console.log("Backend response:", response.data);
      if (response.data.success) {
        setProducts(
          Array.isArray(response.data.products) ? response.data.products : []
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    getProductsData();
  }, []);
  const fetchCart = async () => {
    const response = await axios.get(backendUrl + "/api/cart", {
      headers: { token },
    });
    setCartItems(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  // ✅ Helper function

  //   useEffect(() => {
  //     console.log("✅ Context products updated:", products);
  //   }, [products]);

  const value = {
    products,
    currency,
    shipping_charge,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addToCart,
    cartItems,
    setCartItems,
    getCartCount,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    navigate,
    backendUrl,
    token,
    setToken,
    updateCart,
    syncCartWithDB,
    fetchCart,
    currentUser,
  };

  // console.log("✅ Context products updated:", products);
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

// export default ShopContextProvider;
