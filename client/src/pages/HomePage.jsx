import React, { useContext, useState } from "react";
import LeftSidebar from "../components/LeftSidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  // const [selectedUser, setSelectedUser] = useState(false);
  const {selectedUser} = useContext(ChatContext)

  return (
    <div className="w-full h-screen md:p-15 ">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl h-[100%] grid grid-cols-1 relative overflow-hidden ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}>
        <LeftSidebar/>
        <ChatContainer/>
        <RightSidebar/>
      </div>
    </div>
  );
};

export default HomePage;
