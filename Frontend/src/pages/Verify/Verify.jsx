import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const success = searchParams.get("success");
      const orderId = searchParams.get("orderId");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/verify?success=${success}&orderId=${orderId}`
        );

        if (res.data.success) {
          toast.success("Payment successful!");
        } else {
          toast.error("Payment failed!");
        }

        navigate("/orders");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
        navigate("/orders");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-xl font-semibold">Verifying Payment...</h2>
    </div>
  );
};

export default Verify;