import mongoose from "mongoose";
// import Product from "./product.model.js";

const cartSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    items: [
        {
            product : {type: mongoose.Schema.Types.ObjectId, ref:'Product',required:true},
            quantity: {type: Number, required:true,default:1},
            price: {type: Number, required:true},
        },
    ],
});

export const Cart = new mongoose.model("Cart",cartSchema);
