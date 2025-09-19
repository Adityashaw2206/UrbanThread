import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets.js";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext.jsx";
import { useLocation } from "react-router-dom";
const Navbar = () => {
  const [visible, setVisible] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // refs to detect clicks inside icon/dropdown
  const profileRef = useRef(null);
  const dropdownRef = useRef(null);

  const {
    // setShowSearch,
    getCartCount,
    token,
    navigate,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const logout = () => {
    // if (e && e.stopPropagation) e.stopPropagation(); // keep it inside
    localStorage.removeItem("token");
    // localStorage.removeItem("isLoggedIn");
    setToken("");
    setShowMenu(false);
    setCartItems({});
    navigate("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);
  // Close dropdown when clicking outside profile icon or dropdown (capture phase)
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (
        profileRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) {
        return;
      }
      // setDropdownOpen(false);
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () =>
      document.removeEventListener("click", handleDocumentClick, true);
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium ">
      <Link to="/">
        <img
          src={assets.logo}
          alt=""
          className="w-40 h-20 object-cover rounded-md max-w-[130px]"
        />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink
          to="/"
          className="flex flex-col items-center gap-1 hover:text-gray-900"
        >
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink
          to="/about"
          className="flex flex-col items-center gap-1 hover:text-gray-900"
        >
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink
          to="/contact"
          className="flex flex-col items-center gap-1 hover:text-gray-900"
        >
          <p>Contact</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink
          to="/collections"
          className="flex flex-col items-center gap-1 hover:text-gray-900"
        >
          <p>Collections</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-5">
        {/* <img
          onClick={() => setShowSearch(true)}
          className="w-6 cursor-pointer"
          src={assets.search_icon}
          alt=""
        /> */}

        {/* profile icon area */}
        {!token && location.pathname !== "/signup" && location.pathname !== "/login" ? (
          <Link to="/signup">
            <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-600 transition">
              Sign Up
            </button>
          </Link>
        ) : (
          token &&
          location.pathname !== "/login" && (
            <div className="relative inline-block" ref={menuRef}>
              <img
                src={assets.profile_icon}
                className="w-5 h-6 cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )
        )}
        {/* <div className="relative">
          <img className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
        </div> */}
        {/* <div className="relative">
          {token ? (
            // logged in: toggle dropdown
            <img
              // ref={profileRef}
              className="w-5 cursor-pointer"
              src={assets.profile_icon}
              alt="Profile"
              onClickCapture={(e) => e.stopPropagation()} // <-- stop the document *capture* listener
              onClick={(e) => {
                e.stopPropagation(); // extra safety
                setDropdownOpen((prev) => !prev);
              }}
            />
          ) : (
            // logged out: go to /login
            <Link to="/login">
              <img className="w-5 cursor-pointer" src={assets.profile_icon} alt="Login" />
            </Link>
          )}

          {/* dropdown shown only when logged in AND dropdownOpen === true */}
        {/* {token && dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-8 bg-white shadow-lg rounded z-50"
              onClickCapture={(e) => e.stopPropagation()} // <-- block capture outside
              onClick={(e) => e.stopPropagation()} // keep clicks inside
            >
              <div className="flex flex-col text-sm gap-2 w-36 py-3 px-5 text-gray-700 rounded">
                <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Profile</p>
                <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Orders</p>
                <p
                  onClick={logout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          )} */}
        {/* </div> */}

        <Link to="/cart" className="relative">
          <img className="w-5 min-w-5" src={assets.cart_icon} alt="" />
          <p className="absolute right-[5px] bottom-[-5px] leading-4 text-center bg-red-500 text-white rounded-full text-[8px] w-4 aspect-square">
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* sidebar menu for small screen */}
      <div
        className={`absolute top-0 right-0 h-full bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-64" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              src={assets.cross_icon}
              alt=""
              className="w-5 cursor-pointer hover:bg-gray-400 rounded-full rotate-180"
            />
          </div>
          <NavLink
            className="border py-2 pl-6 text-gray-600 hover:text-black"
            to="/"
            onClick={() => setVisible(false)}
          >
            Home
          </NavLink>
          <NavLink
            className="border py-2 pl-6 text-gray-600  hover:text-black "
            to="/collections"
            onClick={() => setVisible(false)}
          >
            Collections
          </NavLink>
          <NavLink
            className="border py-2 pl-6 text-gray-600  hover:text-black"
            to="/about"
            onClick={() => setVisible(false)}
          >
            About
          </NavLink>
          <NavLink
            className="border py-2 pl-6 text-gray-600  hover:text-black"
            to="/contact"
            onClick={() => setVisible(false)}
          >
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
