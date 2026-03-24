// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { ShopContext } from "../../Context/ShopContext.jsx";

// const ProtectedRoute = ({ children }) => {
//   const { token } = useContext(ShopContext);

//   // if (!token) {
//   //   return <Navigate to="/login" replace />;
//   // }

//   if (!token || token === "undefined" || token === "null") {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;



import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { token, backendUrl, setToken } = useContext(ShopContext);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(backendUrl + "/api/user/profile", {
          headers: { token },
        });
        setIsValid(true);
      } catch (error) {
        // ❌ Token invalid or expired
        localStorage.removeItem("token");
        setToken(null);
        setIsValid(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) return <div>Loading...</div>;

  return isValid ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;