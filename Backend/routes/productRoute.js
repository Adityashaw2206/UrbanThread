// import express from 'express';
// import { addProduct, listProduct, removeProduct, singleProduct } from '../controllers/product.controller.js';
// import upload from '../middleware/multerMiddleware.js';
// import adminAuthMiddleware from '../middleware/adminAuthMiddleware.js';
// const productRouter = express.Router();


// productRouter.post('/add',adminAuthMiddleware,upload.fields([{name:'image',maxCount:1}]), addProduct);
// productRouter.post('/delete',adminAuthMiddleware,removeProduct);
// productRouter.get('/list',listProduct);
// productRouter.get('/single',singleProduct);


// export default productRouter;



import express from 'express';
import { addProduct, listProduct, removeProduct, singleProduct } from '../controllers/product.controller.js';
import upload from '../middleware/multerMiddleware.js';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware.js';

const productRouter = express.Router();

// All routes now require admin auth
productRouter.post('/add', adminAuthMiddleware, upload.fields([{ name:'image', maxCount:1 }]), addProduct);
productRouter.post('/delete', adminAuthMiddleware, removeProduct);
productRouter.get('/list', listProduct);
productRouter.get('/single', adminAuthMiddleware, singleProduct);

export default productRouter;
