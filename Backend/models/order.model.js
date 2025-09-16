// models/Order.js
import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   orderItems: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   shippingAddress: {
//     address: String,
//     city: String,
//     postalCode: String,
//     country: String,
//     phone: String,
//   },
//   paymentMethod: { type: String, required: true },
//   paymentResult: {
//     id: String,
//     status: String,
//     update_time: String,
//     email_address: String,
//   },
//   totalPrice: { type: Number, required: true },
//   isPaid: { type: Boolean, default: false },
//   paidAt: { type: Date },
//   isDelivered: { type: Boolean, default: false },
//   deliveredAt: { type: Date },
//   createdAt: { type: Date, default: Date.now },
// });

const orderSchema = new mongoose.Schema({
    userId : {type: String, required: true},
    // adminId: { type: String, required: true },  // 👈 NEW FIELD
    items: {type: Array, required: true},
    amount : {type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, required: true, default: "Order Placed"}, 
    paymentMethod : {type: String, required: true},
    payment : {type: Boolean, required: true, default: false},
    date: {type: Date, default: Date.now}
})

export const Order = mongoose.model('Order', orderSchema);