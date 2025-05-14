import User from "../Models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'

//Generate access and refresh token 
const createAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
}
const createRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "missing details"
            })
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(403).json({
                success: false,
                message: "User already exist"
            })
        }

        const salt = await bcrypt.genSalt(10)

        //10 = salt rounds (more rounds = more secure but slower).
        //genSalt = creates a random string to make your password hash unique even if two users have the same password.

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName, email, password: hashedPassword
        })

        const accesstoken = createAccessToken(newUser._id)
        const refreshtoken = createRefreshToken(newUser._id)

        newUser.refreshToken = refreshtoken;
        await newUser.save()

        res.cookie("refreshToken", refreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).json({
            success: true,
            userData: newUser,
            accesstoken,
            message: "Account created successfully"
        })
    } catch (error) {
        res.status(500).json({ msg: "Register failed", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing details"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credential"
            })
        }

        const accesstoken = createAccessToken(user._id)
        const refreshtoken = createRefreshToken(user._id)
        user.refreshToken = refreshtoken
        await user.save()


        res.cookie("refreshToken", refreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        return res.status(201).json({
            success: true,
            user,
            accesstoken,
            message: "Logged in successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
}

export const checkAuth = async (req, res) => {
    res.status(201).json({
        success: true,
        user: req.user
    })
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio } = req.body;
        const profilePic = req.file;
        const userId = req.user._id;

        const updateData = {};

        if (fullName) updateData.fullName = fullName;
        if (bio) updateData.bio = bio;
        if (profilePic) {
            const uploadedPic = await cloudinary.uploader.upload(profilePic.path, {
                folder: 'profilePics',
            });
            updateData.profilePic = uploadedPic.secure_url;
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
        });

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully ✨',
            user: updatedUser,
        });
    } catch (error) {
        console.error("Profile update error:", error);

        return res.status(500).json({
            success: false,
            message: 'Something went wrong while updating profile ❌',
            error: error.message,
        });
    }


}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed."
        });
    }
};


export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    // console.log("token:",token);
    if (!token) {
        return res.status(401).json({
            message: "No refresh token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        const newAccessToken = createAccessToken(user._id);
        // Return both token and user data
        res.json({
            accessToken: newAccessToken,
            user,
            message: "Token refreshed "
        });

    } catch (err) {
        res.status(403).json({ msg: "Token expired or invalid" });
    }
};
