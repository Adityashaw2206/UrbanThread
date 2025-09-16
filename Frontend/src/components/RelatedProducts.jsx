import React, { useState } from 'react'
import { ShopContext } from '../Context/ShopContext.jsx';
import { useContext, useEffect } from 'react';
import Title from './Title';
import ProductItem from './ProductItem';
const RelatedProducts = ({category,subCategory}) => {
    const {products} = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    useEffect(() => {
        if(products.length > 0){
            let productCopy = products.slice();
        
            productCopy = productCopy.filter(item => category === item.category)
            productCopy = productCopy.filter(item => subCategory === item.subCategory)

            setRelated(productCopy.slice(0,5));
        }
    },[category, products, subCategory])
  return (
    <div className='flex flex-col my-20'>
      <div className='text-center text-3xl py-5'>
        <Title text1={'Related'} text2={'Products'} />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 my-5'>
        {related.map(item => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            // currency={item.currency}
          />
        ))}

        {/* {
            related.map((item, index) => (
                ProductItem({key: index, id: item._id, image: item.image, name: item.name, price: item.price, currency: item.currency})
            ))
        } */}
      </div>
    </div>
  )
}

export default RelatedProducts
