import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
const Add = ({token}) => {
  const initialProductState = {
    name: "",
    image: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: [],
    bestseller: false,
  };
  const [productData, setProductData] = useState(initialProductState);
  const [image, setImage] = useState(null);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeToggle = (size) => {
    setProductData((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload a product image.");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("subCategory", productData.subCategory);
    formData.append("bestseller", productData.bestseller ? 1 : 0);
    formData.append("sizes", JSON.stringify(productData.sizes));
    formData.append("date", Date.now());

    try {
      const res = await axios.post(
        (backendUrl + "/api/product/add"),
        formData, { headers: { Authorization: `Bearer ${token}` } }
      );
      if(res.data.success){
        toast.success(res.data.message)
        setProductData(initialProductState);
        setImage(null);
      }else{
        toast.error(res.data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add product.");
    }
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <>
      <div className=" flex justify-center md:ml-20 px-4 py-8 w-auto">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>

          <div>
            <p>Upload Image</p>
            <div>
              <label htmlFor="image">
                <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className="w-30"/>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden/>
              </label>
            </div>
          </div>

          <div className="w-full">
            <p className="text-xl font-medium">Product Name</p>
            <input
              type="text"
              name="name"
              placeholder="Type here...."
              value={productData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div className="w-full">
            <p className="text-xl font-medium">Product Description</p>
            <textarea
              name="description"
              placeholder="Write about...."
              value={productData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div className="flex gap-4">
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              required
              className="w-1/3 px-3 py-2 border rounded-md bg-gray-100"
            >
              <option value="">Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>

            <select
              name="subCategory"
              value={productData.subCategory}
              onChange={handleChange}
              required
              className="w-1/3 px-3 py-2 border rounded-md bg-gray-100"
            >
              <option value="">Sub Category</option>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={productData.price}
              onChange={handleChange}
              required
              className="w-1/4 px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <p className="text-gray-700 font-medium mb-2">Product Sizes</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-1 border rounded-full ${
                    productData.sizes.includes(size)
                      ? "bg-pink-200 text-black border-pink-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bestseller"
              checked={productData.bestseller}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-gray-700">Add to bestseller</label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            ADD
          </button>
        </form>
      </div>
    </>
  );
};

export default Add;
