import React from "react";
import { ShopContext } from "../context/ShopContext";
import { useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
const Verify = () => {
  const { token, setCartItems, navigate, backendUrl } = useContext(ShopContext);
  const [searchParams, setSearchparams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
        if(!token){
            return null;
        }

        const response =- await axios.post(`${backendUrl}/api/orders/verifyStripe`,{success, orderId},{headers: {token}});
        if(response.data.success){
            toast.success("Payment verified and order placed successfully!");
            setCartItems({});
            navigate("/orders");
        }else{
            navigate("/cart");
        }
    } catch (error) {
        console.log(error);
        toast.error("Error verifying payment. Please try again.");
    }
  }

  useEffect(() => {

  })
  return 
    <div>
        Verify
    </div>;
};

export default Verify;
