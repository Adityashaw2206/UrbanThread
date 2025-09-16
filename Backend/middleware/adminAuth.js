import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            return res.status(401).json({message: "Unauthorized access"});
        }
    } catch (error) {
        
    }
}