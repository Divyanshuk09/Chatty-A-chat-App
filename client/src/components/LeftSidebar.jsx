import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import logo from "../assets/Logo.png";
import userPfp from "../assets/user_pfp.jpg";
import { userDummyData } from "../assets/assets";

const LeftSidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [searchText, setSearchText] = useState("");

  const toggleMenu = () => setShowMenu((prev) => !prev);

  return (
    <div className={`bg-[#8185B2]/10 h-full p-4 rounded-r-xl overflow-y-auto text-white backdrop-blur-md shadow-xl ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* ---------- Top Header ---------- */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <img src={logo} alt="Chatty Logo" className="w-12" />

          <div className="relative">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <BsThreeDotsVertical className="text-xl" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 z-20 w-36 mt-2 p-3 rounded-lg bg-[#1F1A35] border border-white/10 text-sm text-gray-200 shadow-lg">
                <p onClick={() => { navigate("/profile"); setShowMenu(false)}}
                  className="cursor-pointer hover:text-purple-400 transition">
                  Edit Profile
                </p>
                <hr className="my-2 border-white/10" />
                <p onClick={() => { setShowMenu(false)
                    // Add logout logic here if needed
                  }}
                  className="cursor-pointer hover:text-red-400 transition">
                  Log Out
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Search Bar ---------- */}
      <div className="flex items-center justify-between border border-gray-500 p-2 mt-4 rounded-full bg-white/5 backdrop-blur-md">
        <BsSearch className="text-gray-300 ml-2" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="bg-transparent outline-none px-2 w-full text-white placeholder:text-gray-400"
        />
        {searchText && (
          <IoClose
            onClick={() => setSearchText("")}
            className="text-gray-300 mr-2 cursor-pointer hover:text-red-400 transition"
          />
        )}
      </div>

      {/* ---------- Users List ---------- */}
      <div className="flex flex-col mt-4">
        {userDummyData.map((user, index) => (
          <div
            key={index}
            onClick={() => setSelectedUser(user)}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer transition-all hover:bg-white/5 max-sm:text-sm ${
              selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
            }`}>
            <img
              src={user?.profilePic || userPfp}
              alt={`${user.fullName}`}
              className="w-[35px] aspect-square rounded-full"/>
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>

              <span
                className={`text-sm ${
                  index < 3 ? "text-green-400" : "text-neutral-500"
                }`}>
                {index < 3 ? "Online" : "Offline"}
              </span>
            </div>

            {index > 2 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex items-center justify-center rounded-full bg-violet-500/50">
                {index}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
