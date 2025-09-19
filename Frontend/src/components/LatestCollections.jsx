import React, { useContext, useEffect } from "react";
// import { products } from '../assets/assets'
import { ShopContext } from "../Context/ShopContext.jsx";
import Title from "./Title";
import { useState } from "react";
import ProductItem from "./ProductItem";

const LatestCollections = () => {
  const { products } = useContext(ShopContext);
  // console.log("🟡 LatestCollections got products:", products);

  // console.log(products);
  const [latestProducts, setLatestProducts] = useState([]);
  // useEffect(() => {
  //   setLatestProducts(products.slice(0,10));
  // },[products]);

  useEffect(() => {
    setLatestProducts(Array.isArray(products) ? products.slice(0, 10) : []);
  }, [products]);


  return (
    <div className=" my-10 text-center">
      <div className="p-10 w-full flex flex-col items-center justify-center text-4xl">
        <Title text1="Latest" text2="Collections" />
        <p className="w-3/4 m-auto text-sm text-gray-600 mt-5">
          Discover our latest collections, crafted to match your style and trend
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-10">
        {latestProducts.map((items, index) => {
          return (
            <ProductItem
              key={index}
              id={items._id}
              image={items.image}
              name={items.name}
              price={items.price}
              currency={items.currency}
              className="flex flex-col items-center justify-center border border-gray-300 p-4 rounded-lg"
            />
          );
        })}
      </div>
    </div>
  );
};

export default LatestCollections;
