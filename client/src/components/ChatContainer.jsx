import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import userPfp from "../assets/user_pfp.jpg";

import { BsEmojiSmile } from "react-icons/bs";
import { IoMdImages, IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose, IoSend } from "react-icons/io5";
import { HiMicrophone } from "react-icons/hi";

import { messagesDummyData } from "../assets/assets";
import { formateMessageTime } from "../utils/time";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const [msg, setMsg] = useState(""); // for typed message
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);



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
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {selectedUser?.fullName || "User"}
        </p>
        <div
          onClick={() => setSelectedUser(null)}
          src=""
          alt="Close"
          className="md:hidden w-6 cursor-pointer">
            <IoClose/>
        </div>
        <div className="hidden md:block cursor-pointer">
          <IoMdInformationCircleOutline size={25} />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll scrollbar-hide p-3 pb-6">
        {messagesDummyData.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== "680f5116f10f3cd28382ed02" &&
              "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="media"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white 
                ${
                  msg.senderId === "680f5116f10f3cd28382ed02"
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={userPfp}
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">{formateMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full relative">
          {/* Emoji Picker */}
          {/* //TODO: */}

          {/* Mic */}
          {/* <label className="w-5 ml-2 cursor-pointer text-white"> */}
            {/* <HiMicrophone /> */}
            {/* //TODO: */}
          {/* </label> */}

          {/* Input */}
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Send a message"
            className="outline-0 flex-1 text-sm p-3 border-none rounded-lg text-white placeholder-gray-400 bg-transparent"
          />

          {/* Image Upload */}
          <input type="file" id="image" accept="image/*" hidden />
          <label htmlFor="image" className="w-5 ml-2 cursor-pointer text-white">
            <IoMdImages />
          </label>

          {/* File Upload */}
          <input type="file" id="file" accept=".pdf,.mp3,.doc,.docx" hidden />
          <label htmlFor="file" className="w-5 ml-2 cursor-pointer text-white">
            📎
          </label>
        </div>

        {/* Send */}
        <div className="w-7 cursor-pointer text-white">
          <IoSend />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
