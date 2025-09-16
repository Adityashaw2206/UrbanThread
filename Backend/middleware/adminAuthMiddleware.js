import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await Admin.findById(decoded._id);

    if (!admin) return res.status(401).json({ message: "Invalid token" });

    req.admin = admin; // attach admin info
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default adminAuthMiddleware;
 