import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Order from "./pages/Order.jsx";
import Login from "./components/Login.jsx";
import AdminRegister from "./components/AdminRegister.jsx";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          setToken("");
          localStorage.removeItem("token");
        } else {
          const timeLeft = decoded.exp - currentTime;
          const logoutTimer = setTimeout(() => {
            setToken("");
            localStorage.removeItem("token");
          }, timeLeft * 1000);
          return () => clearTimeout(logoutTimer);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        setToken("");
        localStorage.removeItem("token");
      }
    }
  }, [token]);

  if (!token) {
    return (
      <div className="bg-gray-50 min-h-screen w-full">
        <ToastContainer />
        <Routes>
          <Route path="/admin/login" element={<Login setToken={setToken} />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    );
  }

  // Authenticated layout
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <ToastContainer />
      <Navbar setToken={setToken} />
      <div className="flex pt-30">
        <Sidebar />
        <div className="ml-40 px-6 min-h-screen text-gray-600 text-base w-full">
          <Routes>
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/orders" element={<Order token={token} />} />
            <Route path="*" element={<Navigate to="/add" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
