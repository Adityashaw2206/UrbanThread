import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
const List = ({ token }) => {
  const [list, setList] = useState([]);
  
  // const adminToken = localStorage.getItem("adminToken");
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list', {
      headers: {
        Authorization: `Bearer ${token}`, // 👈 Add this
      }});
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
      toast.error("Failed to fetch product list.");
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/delete`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Product deleted successfully");
        setList((prevList) => prevList.filter((item) => item._id !== id));
      } else {
        toast.error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="md:ml-40 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Products</h1>
      <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
        {list.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 p-4 rounded-xl shadow hover:shadow-lg transition-all bg-white"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-contain rounded mb-3"
            />
            <div className="flex justify-between items-center mb-1 gap-2">
              <h2 className="text-base font-semibold text-gray-800 flex-1 break-words">
                {product.name}
              </h2>
              <span className="text-pink-600 font-bold text-sm shrink-0 whitespace-nowrap">
                $ {product.price}
              </span>
            </div>




            <p className="text-sm text-gray-500 mb-1">
              Category: <span className="font-medium">{product.category}</span> /{' '}
              <span>{product.subCategory}</span>
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Sizes: <span className="font-medium">{product.sizes.join(', ')}</span>
            </p>

            {product.bestseller === true || product.bestseller === 1 ? (
              <span className="inline-block mt-2 text-xs text-white bg-yellow-500 px-2 py-1 rounded-full">
                Bestseller
              </span>
            ) : null}

            <p className="text-xs text-gray-400 mt-2">
              Date: {new Date(product.date).toLocaleDateString()}
            </p>

            <button
              onClick={() => removeProduct(product._id)}
              className="mt-3 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
