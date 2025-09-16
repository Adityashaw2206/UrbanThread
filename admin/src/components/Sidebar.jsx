import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";

const Sidebar = () => {
  return (
    <div className="fixed top-30 left-0 h-full w-40 md:w-64 bg-white border-r border-gray-200 p-2 md:p-6 z-10">
      <div className="flex flex-col gap-2 text-sm">
        <NavLink
          to="/add"
          className="flex items-center gap-2 border border-gray-300 px-2 py-2 text-xs rounded-md hover:bg-gray-100"
        >
          <img className="w-4 h-4" src={assets.add_icon} alt="Add" />
          <p>Add Items</p>
        </NavLink>

        <NavLink
          to="/list"
          className="flex items-center gap-2 border border-gray-300 px-2 py-2 text-xs rounded-md hover:bg-gray-100"
        >
          <img className="w-4 h-4" src={assets.order_icon} alt="List" />
          <p>List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className="flex items-center gap-2 border border-gray-300 px-2 py-2 text-xs rounded-md hover:bg-gray-100"
        >
          <img className="w-4 h-4" src={assets.order_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
