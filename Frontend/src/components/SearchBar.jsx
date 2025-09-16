import {assets} from '../assets/assets';
import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';


const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const location = useLocation();

  const isAllowedPage =
    location.pathname === '/collections' || location.pathname === '/' || location.pathname === '/home';

  if (!isAllowedPage) return null;

  
  return (
    <div className=' border rounded-full shadow-lg p-3 mb-12 border-gray-200 transition-all duration-300'>
      <div className={` flex items-center justify-between`}>
        <img className='mx-2 h-6 w-6' src={assets.search_icon} alt="search" />
        <input
              type="text"
              className="px-0 flex-1 py-2 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 rounded-full"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {/* <button
              className="ml-3 px-3 py-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors duration-200 shadow-sm"
              onClick={() => setShowSearch(false)}
              title="Close"
            >
              ✕
            </button> */}
      </div>
    </div>
  )


};

export default SearchBar;