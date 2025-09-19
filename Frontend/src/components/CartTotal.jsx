
import Title from './Title';
// import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';

const CartTotal = ({currency, shipping_charge, cartData=[]}) => {
  // const {currency, shipping_charge, cartData=[]} = useContext(ShopContext)
//   const navigate = useNavigate();

  const totalQuantity = cartData.reduce((sum, item) => sum + item.quantity, 0);
  const Subtotal = cartData.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalShipping = shipping_charge * totalQuantity;
  const totalPrice = Subtotal + totalShipping;

  return (
    <div className='w-full'>
      {/* <div className="text-2xl"> */}
    <div className='text-2xl'>
        <Title text1="Order" text2="Summary" />
    </div>
    <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
            <p>Subtotal</p>
            <p>{currency}{Subtotal}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <p>Shipping</p>
            <p>{currency}{totalShipping}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <p>Total</p>
            <p>{currency}{totalPrice}.00</p>
        </div>
        <hr />
    </div>
      {/* </div> */}
      {/* <div className='w-[50%] flex justify-end ml-auto'>
        <button
          className="w-10px mt-4 px-6 py-2 text-white bg-black border border-black rounded active:bg-gray-400  transition"
          onClick={() => navigate('/place-order')}
        >
          Proceed To Checkout
        </button>
      </div> */}
    </div>
  );
};

export default CartTotal;