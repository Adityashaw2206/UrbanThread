// import {v2 as cloudinary} from "cloudinary";
// import { Product } from "../models/product.model.js";
// //function for add product

// import ApiError from "../utils/ApiErrors.js";

// const addProduct = async(req,res) => {
//     try {
//         const {name,description,price,category,subCategory,sizes,bestseller} = req.body;

//         // console.log("Request body:", req.body);
//         // console.log("Files:", req.files);
        
//         // Check required fields
//         if (!name || !description || !price || !category || !subCategory || !sizes) {
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }

//         const image = req.files && req.files.image && req.files.image[0] ? req.files.image[0] : undefined;
//         //mapping the image excluding undefined image
//         const images = [image].filter((item) => item !== undefined)

//         let imagesUrl = [];
//         if (images.length > 0) {
//             try {
//                 imagesUrl = await Promise.all(
//                     images.map(async (item) => {
//                         let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
//                         return result.secure_url;
//                     })
//                 );
//             } catch (cloudErr) {
//                 return res.status(500).json({ success: false, message: "Image upload failed" });
//             }
//         }

//         let parsedSizes;
//         try {
//             parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
//         } catch (e) {
//             parsedSizes = [];
//         }
        
//         const productData = {
//             name,
//             description,
//             price: Number(price),
//             category,
//             subCategory,
//             bestseller: String(bestseller) === "1",
//             sizes : parsedSizes,
//             image: imagesUrl.length > 0 ? imagesUrl[0] : "",
//             date: Date.now()
//         }

//         const product = new Product(productData)
//         await product.save()

//         res.json({success: true, message: "Product added successfully"});
        
//     } catch (error) {
//         console.log(error);
        
//         res.status(500).json({ success: false, message: "Internal Server Error" });

//     }
// }

// //function ofr list product

// const listProduct = async(req,res) =>{
//     try {
//         const products = await Product.find({});
//         // console.log("Products from DB:", products);
//         res.json({success: true, products});
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Failed to list the items" });
        
//     }
// }

// //function for removing product

// const removeProduct = async(req,res) => {
//     try {
//         await Product.findByIdAndDelete(req.body.id);
//         res.json({success: true, message: "Product removed successfully"});
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Failed to delete the product" });
//     }
// } 

// //function for single product details

// const singleProduct = async(req,res) => {
//     try {
//         const {productId} = req.body;
//         const product = await Product.findById(productId)
//         if(!product) {
//             throw new ApiError(404, "Product not found");
//         }
//         res.json({success:true,product});
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Failed to load the product details"});
        
//     }
    
// }


// export { addProduct, listProduct, removeProduct, singleProduct };





import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiErrors.js";

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    if (!name || !description || !price || !category || !subCategory || !sizes) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const image = req.files?.image?.[0];
    let imagesUrl = [];

    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
        imagesUrl.push(result.secure_url);
      } catch (cloudErr) {
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    }

    let parsedSizes;
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch (e) {
      parsedSizes = [];
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: String(bestseller) === "1",
      sizes: parsedSizes,
      image: imagesUrl.length > 0 ? imagesUrl[0] : "",
      date: Date.now(),
      admin: req.admin._id   // ✅ store creator admin
    };

    const product = new Product(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// List products → show all products
const listProduct = async (req, res) => {
  try {
    const products = await Product.find({}); // fetch all products
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove product → only if this admin owns it
const removeProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.body.id,
      adminId: req.adminId
    });

    if (!product) {
      return res.status(403).json({ success: false, message: "You cannot delete this product" });
    }

    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to delete the product" });
  }
};

// Single product → only if this admin owns it
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findOne({ _id: productId, adminId: req.adminId });

    if (!product) {
      return res.status(403).json({ success: false, message: "Not authorized to view this product" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to load the product details" });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
