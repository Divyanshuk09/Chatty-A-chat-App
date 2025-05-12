import React, { useState } from 'react';
import { FaPhotoVideo, FaFileAlt, FaMusic, FaLink, FaMicrophone } from 'react-icons/fa';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import userPfp from "../assets/user_pfp.jpg";
import { messagesDummyData } from '../assets/assets';

const RightSidebar = ({ selectedUser }) => {

const [showModal, setShowModal] = useState(false);
const [currentImageIndex, setCurrentImageIndex] = useState(0);

const imageMessages = messagesDummyData.filter((msg)=>msg.image)


const openModal=(index)=>{
    setCurrentImageIndex(index);
    setShowModal(true)
}

const closeModal=()=>setShowModal(false);

const nextImage=()=> setCurrentImageIndex((prev)=>(prev+1)%imageMessages.length);

const prevImage=()=> setCurrentImageIndex((prev)=>(prev-1)%imageMessages.length);

  if (!selectedUser) return null;

  return (
    <div className="bg-[#1e1f3b] text-white w-full h-full relative max-md:hidden">
      {/* Profile Section */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light px-4">
        <img
          src={selectedUser?.profilePic || userPfp}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <h1 className="text-xl font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {selectedUser.fullName}
        </h1>
        <p className="text-center text-sm text-gray-400">{selectedUser.bio}</p>
      </div>

      <hr className="my-4 border-white/10" />

      {/* Files Section */}
      <div className="px-5 text-xs flex flex-col gap-5">
        <h2 className="text-sm font-semibold">Media</h2>

        {/* Photo Thumbnails */}
        <div className="max-h-60 overflow-x-auto scrollbar-hide">
        <div className="grid grid-cols-4 gap-2 min-w-max">
            {imageMessages.map((msg, index) => (
            <div className="cursor-pointer rounded" key={msg._id} onClick={() => openModal(index)}>
                <img src={msg.image} alt="media" className="w-20 h-20 object-cover rounded" />
            </div>
            ))}
        </div>
        </div>

        {/* File Types */}
        <div className="flex flex-col gap-3 text-sm text-gray-300">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><FaPhotoVideo /> 265 photos</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><FaFileAlt /> 378 files</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><FaMusic /> 21 audio files</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><FaLink /> 45 shared links</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><FaMicrophone /> 2,589 voice messages</span>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={closeModal}>✖</button>
            <button className="absolute left-5 text-white text-2xl" onClick={prevImage}><FaArrowLeft /></button>
            <img
            src={imageMessages[currentImageIndex]?.image}
            alt="preview"
            className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
            />
            <button className="absolute right-5 text-white text-2xl" onClick={nextImage}><FaArrowRight /></button>
        </div>
)}

    </div>
  );
};

export default RightSidebar;
