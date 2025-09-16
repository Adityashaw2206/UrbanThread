// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: { type: String ,required: true },
//   category: { type: String, required: true },
//   subCategory: { type: String, required: true },
//   sizes: { type: [String], required: true },
//   // brand: { type: String },
//   // countInStock: { type: Number, default: 0 },
//   bestseller: { type: Boolean, required: true },
//   date: { type: Number, required: true },
//   // createdAt: { type: Date, default: Date.now },
// },
// {
//     timestamps: true,
// });

// export const Product = mongoose.model('Product', productSchema);


import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String ,required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: [String], required: true },
  bestseller: { type: Boolean, required: true },
  date: { type: Number, required: true },
  // admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },  // NEW
  // 🔹 NEW FIELD to track which admin added the product
  // admin: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: "Admin", 
  //   required: true 
  // }
},
{
    timestamps: true,
});

export const Product = mongoose.model('Product', productSchema);
