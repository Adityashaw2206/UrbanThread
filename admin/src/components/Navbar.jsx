import React from 'react';
import { assets } from '../assets/assets.js';

const Navbar = ({ setToken }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-30 bg-white shadow flex items-center justify-between px-6 sm:px-12 z-40 ">
      <img src={assets.logo} alt="logo" className="w-40 h-20 rounded-md" />
      <button
        onClick={() => setToken('')}
        className="bg-gray-800 px-3 py-1.5 hover:bg-gray-600 rounded-full text-xs sm:text-sm text-white"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
