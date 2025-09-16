import express from 'express';
import { addToCart, getUserCart, updateCart } from '../controllers/cart.controller.js';
import authUser from '../middleware/authMiddleware.js';



const cartRouter = express.Router();

cartRouter.get('/',authUser,getUserCart);
cartRouter.post('/add',authUser, addToCart); 
cartRouter.post('/update',authUser, updateCart);


export default cartRouter;