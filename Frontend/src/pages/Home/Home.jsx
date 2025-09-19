import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext.jsx';
import ProductItem from '../../components/ProductItem.jsx';
import Hero from '../../components/Hero.jsx';
import LatestCollections from '../../components/LatestCollections.jsx';
import BestSeller from '../../components/BestSeller.jsx';
import OurPolicy from '../../components/OurPolicy.jsx';

const Home = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (showSearch && search) {
      const results = products.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [products, search, showSearch]);

  return (
    <div>
      {showSearch && search ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-5 mt-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(item => (
              <ProductItem key={item._id} {...item} />
            ))
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      ) : (
        <>
          <Hero />
          <LatestCollections />
          <BestSeller />
          <OurPolicy />
        </>
      )}
    </div>
  );
};

export default Home;

