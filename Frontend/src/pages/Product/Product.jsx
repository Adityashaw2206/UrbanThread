
import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";
import RelatedProducts from "../../components/RelatedProducts.jsx";
import ProductReviews from "../../components/ProductReviews .jsx";

const Product = () => {
  const { currentUser } = useContext(ShopContext); 
  const { productId } = useParams();
  const { products, addToCart, navigate } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState("");
  const sizeContainerRef = useRef(null);

  useEffect(() => {
    if (products && productId) {
      const foundProduct = products.find(
        (item) => String(item._id) === String(productId)
      );
      setProductData(foundProduct);
    }
  }, [products, productId]);

  // 🔹 Clear size if user clicks outside size buttons
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        size &&
        sizeContainerRef.current &&
        !sizeContainerRef.current.contains(event.target)
      ) {
        setSize("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [size]);

  if (!productData) {
    return (
      <div className="p-8 text-center text-gray-500">Product not found.</div>
    );
  }

  return (
    <div className="flex flex-col w-full mx-auto p-4 bg-white">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left Side - Image */}
        <div className="w-full md:w-[50%] flex justify-center mb-4 md:mb-0">
          <img
            src={productData.image}
            alt={productData.name}
            className="w-full h-auto max-w-xs object-contain rounded"
          />
        </div>

        {/* Right Side - Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
          <p className="text-xl text-gray-700 mb-4">${productData.price}</p>
          <p className="text-gray-600 mb-4">{productData.description}</p>

          {/* Category & Subcategory */}
          <div className="flex gap-4">
            <span className="bg-gray-200 px-3 py-1 rounded text-sm">
              {productData.category}
            </span>
            <span className="bg-gray-200 px-3 py-1 rounded text-sm">
              {productData.subCategory}
            </span>
          </div>

          {/* Size Selector */}
          <div className="flex flex-col gap-5 my-5" ref={sizeContainerRef}>
            <p>Select Size</p>
            <div className="flex gap-3">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 bg-gray-200 border rounded transition ${
                    item === size ? "border-pink-600" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSize(item);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart & Go to Cart */}
          <div className="flex gap-3">
            <button
              className="w-10px mt-4 px-6 py-2 bg-white text-black border border-black rounded active:bg-gray-400 transition"
              onClick={() => addToCart(productData._id, size)}
            >
              Add to Cart
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="w-10px mt-4 px-6 py-2 bg-black text-white rounded active:bg-gray-700 transition"
            >
              Go To Cart
            </button>
          </div>

          <div className="mt-4 text-gray-500">
            <p>100% Original Product</p>
            <p>Cash on Delivery Available</p>
            <p>Easy 10 days returns and exchanges</p>
          </div>
        </div>
      </div>

      {/* ✅ Reviews Section */}
      <ProductReviews productId={productData._id} user={currentUser} />

      {/* Related Products */}
      <div className="w-full text-4xl">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;
