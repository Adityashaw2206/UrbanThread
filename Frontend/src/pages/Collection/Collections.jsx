import React, { useContext, useEffect, useState } from 'react'
import {ShopContext} from '../../context/ShopContext.jsx'
import Title from '../../components/Title.jsx'
import ProductItem from '../../components/ProductItem.jsx'
import RelatedProducts from '../../components/RelatedProducts.jsx'
const Collections = () => {
  const {products, search, showSearch} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  // for selected filtered product
  const [category, setCategory] = useState([]);
  // for displaying those filterded products
  const [subCategory, setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('default'); 


  const toggleCategory = (e) => {
    if(category.includes(e.target.value)){
      setCategory(prev=> prev.filter(item => item !== e.target.value));
    }
    else{
      setCategory(prev => [...prev, e.target.value]);
    }
  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)){
      setSubCategory(prev=> prev.filter(item => item !== e.target.value));
    }
    else{
      setSubCategory(prev => [...prev, e.target.value]);
    }
  }

  useEffect(() => {
    let productsCopy = products.slice();

    if (category.length > 0 || subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => {
        const categoryMatch = category.length === 0 || category.includes(item.category);
        const subCategoryMatch = subCategory.length === 0 || subCategory.includes(item.subCategory);
        return categoryMatch && subCategoryMatch;
      });
    }

      // Sort if needed
      if (sortType === 'price-low-to-high') {
        productsCopy = productsCopy.sort((a, b) => a.price - b.price);
      } else if (sortType === 'price-high-to-low') {
        productsCopy = productsCopy.sort((a, b) => b.price - a.price);
      }

    // Filter by search term
    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    setFilterProducts(productsCopy);
  }, [category, subCategory, products, showSearch, search, sortType]);

  
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 '>
      {/* Filter Section */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          filters
        </p>
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          {/* <h3 className='font-bold mb-2'>Filters</h3> */}
          {/* Add filter options here */}
          <p>Catagory.</p>
          <p className='flex gap-2'>
            <input onChange={toggleCategory} className='w-3'  type="checkbox" value={'Men'}/>Men
          </p>
          <p className='flex gap-2'>
            <input onChange={toggleCategory} className='w-3'  type="checkbox" value={'Women'}/>Women
          </p>
          <p className='flex gap-2'>
            <input onChange={toggleCategory} className='w-3'  type="checkbox" value={'Kids'}/>Kids
          </p>
        </div>
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          {/* <h3 className='font-bold mb-2'>Type</h3> */}
          {/* Add filter options here */}
          <p>Type</p>
          <p className='flex gap-2'>
            <input className='w-3'  type="checkbox" value={'Topwear'} onChange={toggleSubCategory}/>Topwear
          </p>
          <p className='flex gap-2'>
            <input className='w-3'  type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory}/>Bottomwear
          </p>
          <p className='flex gap-2'>
            <input className='w-3'  type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/>Winterwear
          </p>
        </div>
        {/* right side */}
      </div>
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select onChange={(e) => setSortType(e.target.value)} className=' border-2 border-gray-300 text-sm px-2 py-1'>
            <option value="default">Default</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
          </select>
        </div>
        {/* map product */}
        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-5'>
          {
            filterProducts.map((item,index) => (
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
            ))
          }
        </div> 

      </div>
    </div>
  )
}

export default Collections
