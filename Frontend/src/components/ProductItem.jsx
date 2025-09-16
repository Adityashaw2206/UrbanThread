import { useContext } from "react";
import {ShopContext} from "../Context/ShopContext.jsx";
import { Link } from "react-router-dom";
import React from 'react'

const ProductItem = ({id,image,name,price}) => {
    const {currency} = useContext(ShopContext);
  return (
    <div>
      <Link className="flex flex-col items-center justify-center border border-gray-300 p-4 rounded-lg" to={`/product/${id}`}>
        <div className="overflow-hidden">
            <img src={image} alt={name} className="hover:scale-110 transition ease-in-out" />
        </div>
        <p className="text-sm font-semibold pt-3 pb-1">{name}</p>
        <p className="text-gray-500">{currency}{price}</p>
      
      </Link>
    </div>
  )
}

export default ProductItem
