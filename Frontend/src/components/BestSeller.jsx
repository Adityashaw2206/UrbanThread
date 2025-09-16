import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext.jsx'
import Title from './Title'
import ProductItem from './ProductItem'
const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);
    
    useEffect(() => {
      if (products && Array.isArray(products)) {
          // console.log(products);
          const bestProduct = products.filter((item) => item.bestseller);
          setBestSeller(bestProduct.slice(0, 6));
          // console.log("Best Sellers:", bestProduct.slice(0, 5));
          // console.log("Best Sellers:", bestProduct);
        }
    },[products]);

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-10'>
        <Title text1={'Best'} text2={'Seller'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, mollitia.
        </p>
      </div>
      
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {
          bestSeller.map((item,index) => (
            <ProductItem key={index} id= {item._id} name={item.name} image={item.image} price={item.price} />
          ))
        }
      </div>
    </div>
  )
};

export default BestSeller
 