import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import CartTotal from '../../components/CartTotal';

const Cart = () => {
  const { cartItems, currency, products,shipping_charge,
          removeFromCart, increaseQuantity, decreaseQuantity,navigate
        } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    // Flatten cartItems into an array of {product, size, quantity}
    const items = [];
    Object.entries(cartItems).forEach(([productId, sizesObj]) => {
      Object.entries(sizesObj).forEach(([size, qty]) => {
        const product = products.find(p => String(p._id) === String(productId));
        if (product) {
          items.push({ ...product, size, quantity: qty });
        }
      });
    });
    setCartData(items);
  }, [cartItems, products]);


  // Calculate total shipping: shipping_charge * total quantity
  // const totalQuantity = cartData.reduce((sum, item) => sum + item.quantity, 0);
  // const Subtotal = cartData.reduce((sum,item) => sum + item.quantity*item.price,0);
  // const totalShipping = shipping_charge * totalQuantity;
  // const totalPrice = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0) + totalShipping;
  
  
  return (
    <div className="p-6">
      <div className="text-3xl mb-10">
        <Title text1="Your" text2="Cart"  />
      </div>
      {cartData.length === 0 ? (
        <p className="font-bold text-black text-center">Your cart is empty.</p>
      ) : (
        <div className=" space-y-4  mt-4">
          {cartData.map((item) => (
            <div key={item._id + item.size} className=" flex flex-col  gap-4 pb-4">
              <div className='flex gap-10 mb-5'>
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1  flex-row">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-700">
                    Price: {currency}{item.price} x {item.quantity} = <span className="font-bold">{currency}{item.price * item.quantity}</span>
                  </p>
                </div>
              </div>
              <div className=' flex flex-row gap-5 pt-5'>
                <div className="flex justify-center items-center gap-2 m-2 ">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                     onClick={() => decreaseQuantity(item._id, item.size)}
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => increaseQuantity(item._id, item.size)}
                  >+</button>
                </div>
                <div className='border-b ml-5 items-center p-auto m-auto'>
                  <img onClick={() => removeFromCart(item._id,item.size,0)} className='w-5 cursor-pointer ' src={assets.bin_icon} alt="" />
                </div>
              </div>
              <hr />
            </div>
          ))}
          <CartTotal  cartData={cartData} currency={currency} shipping_charge={shipping_charge}/>
          <div className='w-[50%] flex justify-end ml-auto'>
            <button
              className="w-10px mt-4 px-6 py-2 text-white bg-black border border-black rounded active:bg-gray-400  transition"
              onClick={() => navigate('/place-order')}
            >
              Proceed To Checkout
            </button>
          </div>
        {/* cart total */}
          {/* <div className="flex flex-col justify-end w-[50%] ml-auto pt-5">
            <div  className='text-left text-3xl'>
              <Title text1="Cart" text2="Total" />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
              <div className='flex justify-between'>
                <p className=''>Subtotal</p>
                <p>{currency}{Subtotal}.00</p>
              </div>
              <hr />
              <div className='flex justify-between'>
                <p className=''>Shipping</p>
                <p>{currency}{totalShipping}.00</p>
              </div>
              <hr />
              <div className='flex justify-between'>
                <p className=''>Total</p>
                <p>{currency}{totalPrice}.00</p>
              </div>
              <hr />
            </div>
          </div>
          <div className='w-[50%] flex justify-end ml-auto'>
              <button
                className="w-10px mt-4 px-6 py-2 text-white bg-black border border-black rounded active:bg-gray-400  transition"
                onClick={() => navigate('/place-order')}
                >
                  Proceed To Checkout
              </button>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Cart;