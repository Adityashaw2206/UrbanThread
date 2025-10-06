import React from "react";
import Product from "./pages/Product/Product.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Collections from "./pages/Collection/Collections.jsx";
import About from "./pages/About/About.jsx";
import Home from "./pages/Home/Home.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Login from "./pages/Login/Login.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import SearchBar from "./components/SearchBar.jsx";
import { ToastContainer } from "react-toastify";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword .jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import "react-toastify/dist/ReactToastify.css";
// import Verify from './pages/Verify.jsx'
import Profile from "./pages/Profile/profile.jsx";
const App = () => {
  // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] ">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        {/* <Route path='/' element={<Login/>} /> */}
        {/* <Route path='/' element={<Home />} /> */}
        {/* <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        /> */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* <Route path="/verify" element={<Verify />} /> */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
