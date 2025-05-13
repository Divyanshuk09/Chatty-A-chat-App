import jwt from 'jsonwebtoken';
import User from '../Models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access", error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // secret should match the one used during token creation

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access", error: "User not found" });
        }
        req.user = user; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized access", error: err.message });
    }
};
