import React, { useContext, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import userPfp from "../assets/user_pfp.jpg";

import { BsEmojiSmile } from "react-icons/bs";
import { IoMdImages, IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose, IoSend } from "react-icons/io5";
import { HiMicrophone } from "react-icons/hi";

import { formateMessageTime } from "../utils/time";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { selectedUser, setSelectedUser, messages, sendMessage, setMessages, getMessages } = useContext(ChatContext);
  const { onlineUser, authUser } = useContext(AuthContext);

  const [msg, setMsg] = useState(""); // for typed message
  const [selectedImage, setSelectedImage] = useState(null); // for image preview
  const [caption, setCaption] = useState(""); // for image caption
  const [showImageModal, setShowImageModal] = useState(false);
  const captionInputRef = useRef(null);
  const scrollEnd = useRef();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // If we're in image preview mode, send the image with caption
    if (showImageModal && selectedImage) {
      await sendMessage({ 
        image: selectedImage,
        text: caption.trim() 
      });
      setSelectedImage(null);
      setCaption("");
      setShowImageModal(false);
      return;
    }
    
    // Otherwise send regular text message
    if (msg.trim() === "") return null;
    await sendMessage({ text: msg.trim() });
    setMsg("");
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("Select Image file only.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setShowImageModal(true);
      setCaption(""); // Reset caption when new image is selected
    };
    reader.readAsDataURL(file);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  // Auto-focus caption input when modal opens
  useEffect(() => {
    if (showImageModal && captionInputRef.current) {
      captionInputRef.current.focus();
    }
  }, [showImageModal]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);
  
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) return <div className="hidden md:block" />;

  return (
    <div className="h-full overflow-y-auto relative backdrop-blur-lg text-white">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser?.profilePic || userPfp}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="flex-1 text-lg flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${onlineUser.includes(selectedUser._id) ? "bg-green-500" : "bg-neutral-500"}`}></span>
          {selectedUser?.fullName || "User"}
        </p>
        <div
          onClick={() => setSelectedUser(null)}
          alt="Close"
          className="md:hidden w-6 cursor-pointer">
          <IoClose />
        </div>
        <div className="hidden md:block cursor-pointer">
          <IoMdInformationCircleOutline size={25} />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll scrollbar-hide p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <div className="flex flex-col rounded-l-lg rounded-tr-lg  p-1 bg-violet-500/30 mb-8">
                <img
                  src={msg.image}
                  alt="media"
                  className="max-w-[230px] border border-gray-700 overflow-hidden rounded-t-lg"
                />
                {msg.text && (
                  <p className={`p-2 md:text-sm font-light break-all  text-white 
                    ${msg.senderId === authUser._id ? "rounded-br-none" : "rounded-bl-none"}`}
                  >
                    {msg.text}
                  </p>
                )}
              </div>
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white 
                ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id 
                  ? authUser?.profilePic || userPfp 
                  : selectedUser?.profilePic || userPfp
                }
                alt="pfp"
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">{formateMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full relative">
            {/* Image Upload */}
            <input 
              type="file" 
              id="image" 
              accept="image/*" 
              hidden 
              onChange={handleImageSelect}
            />
            <label htmlFor="image" className="w-5 ml-2 cursor-pointer text-white">
              <IoMdImages />
            </label>

            {/* Text Input */}
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
              placeholder="Send a message"
              className="outline-0 flex-1 text-sm p-3 border-none rounded-lg text-white placeholder-gray-400 bg-transparent"
            />
          </div>

          {/* Send Button */}
          <button 
            className="w-7 cursor-pointer text-white" 
            onClick={handleSendMessage}
            disabled={!msg.trim()}
          >
            <IoSend />
          </button>
        </div>
      </div>

      {/* Full-screen Image Preview Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          {/* Close Button */}
          <button 
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-gray-800"
          >
            <IoClose size={24} />
          </button>
          
          {/* Image Preview */}
          <div className="flex-1 flex items-center justify-center w-full">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="max-h-[70vh] max-w-full object-contain" 
            />
          </div>
          
          {/* Caption Input Area */}
          <div className="w-full max-w-md mt-4 flex items-center gap-2">
            <input
              type="text"
              ref={captionInputRef}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
              placeholder="Add a caption..."
              className="flex-1 bg-gray-800 text-white p-3 rounded-lg outline-none"
              autoFocus
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectedImage}
              className="bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50"
            >
              <IoSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;