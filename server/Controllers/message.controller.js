import {v2 as cloudinary} from 'cloudinary'
import Message from "../Models/message.model.js";
import User from "../Models/user.model.js";
import { io,userSocketMap } from '../server.js';

// Controller to fetch all users (except the current one) for the left sidebar
// Also fetches the count of unseen messages from each user
export const getuserforleftsidebar = async (req, res) => {
    try {
        const userId = req.user._id; // ID of the currently logged-in user

        // Fetch all users excluding the current user, and remove their password field from response
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password'); //$ne means not include

        // Object to store how many unseen messages are there from each user
        const unseenMessages = {};

        // Loop through each user to check how many unseen messages they have sent to current user
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,     // messages sent by this user
                receiverId: userId,     // received by current user
                seen: false             // and not seen yet
            });

            // If there are unseen messages, store the count against their userId
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }

            //TODO: Add last message functionality like instagram and whatsapp

        });

        // Wait for all the message queries to complete
        await Promise.all(promises);

        // Send response: list of all users (except current), and unseen message counts
        res.status(201).json({
            users: filteredUsers,
            unseenMessages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//get all message for selected user

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params; // ID of the user you're chatting with
        const myId = req.user._id; // Logged-in user's ID

        // Fetch all messages between the logged-in user and the selected user
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });

        // Mark all messages sent by selected user to logged-in user as seen
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId },
            { seen: true }
        );

        // Return the message list
        return res.status(201).json({
            success: true,
            messages
        });

    } catch (error) {
        // Handle server errors
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//api to mark message as seen using message id

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true })

        return res.status(201).json({
            success: true,
            message: "Marked as seen"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//send message to selected user

export const sendMessage = async (req,res) => {
    try {
        const {text,image} = req.body;
        const receiverId = req.params.id;
        const senderId  =req.user._id;

        let imageUrl;
        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image.path,{
                folder: 'ChatMedia',
            });
            imageUrl = uploadImage.secure_url;
        }

        const newMessage =  await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        //emit the new message to the receivers socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        
        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}