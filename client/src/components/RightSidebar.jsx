import React, { useContext, useState } from 'react';
import { 
  FaPhotoVideo, 
  FaFileAlt, 
  FaMusic, 
  FaLink, 
  FaMicrophone,
  FaArrowLeft,
  FaArrowRight,
  FaTimes
} from 'react-icons/fa';
import userPfp from "../assets/user_pfp.jpg";
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageMessages = messages.filter((msg) => msg.image);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const nextImage = () => 
    setCurrentImageIndex((prev) => (prev + 1) % imageMessages.length);

  const prevImage = () => 
    setCurrentImageIndex((prev) => (prev - 1 + imageMessages.length) % imageMessages.length);

  if (!selectedUser) return null;

  return (
    <div className="bg-[#1e1f3b] text-white w-full h-full relative max-md:hidden overflow-y-auto">
      {/* Profile Section */}
      <div className="pt-8 pb-4 flex flex-col items-center gap-3 text-sm px-6 border-b border-white/10">
        <div className="relative group">
          <img
            src={selectedUser?.profilePic || userPfp}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/50 shadow-lg group-hover:border-purple-400 transition-all"
          />
          <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#1e1f3b] ${
            onlineUser.includes(selectedUser._id) ? 'bg-green-500' : 'bg-gray-500'
          }`}></div>
        </div>
        
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">{selectedUser.fullName}</h1>
          <p className="text-sm text-purple-200 mt-1">{selectedUser.bio || "Hey there! I'm using ChatApp"}</p>
        </div>
      </div>

      {/* Files Section */}
      <div className="px-5 py-4 ">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-300">
          <FaPhotoVideo className="text-purple-400" /> Media
        </h2>

        {/* Photo Thumbnails */}
        {imageMessages.length > 0 ? (
          <div className="mb-8">
            <div className="grid grid-cols-3 grid-rows-2 gap-3">
              {imageMessages.map((msg, index) => (
                <div
                  key={msg._id}
                  className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform"
                  onClick={() => openModal(index)}
                >
                  <img 
                    src={msg.image} 
                    alt="media" 
                    className="w-full h-24 object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No media shared yet
          </div>
        )}

        {/* File Types */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-3">
              <FaPhotoVideo className="text-purple-400" /> Photos
            </span>
            <span className="text-purple-300">{imageMessages.length}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-3">
              <FaFileAlt className="text-blue-400" /> Files
            </span>
            <span className="text-blue-300">0</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-3">
              <FaMusic className="text-pink-400" /> Audio
            </span>
            <span className="text-pink-300">0</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-3">
              <FaLink className="text-green-400" /> Links
            </span>
            <span className="text-green-300">0</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-3">
              <FaMicrophone className="text-yellow-400" /> Voice
            </span>
            <span className="text-yellow-300">0</span>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button 
            className="absolute top-6 right-6 text-white text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={closeModal}
          >
            <FaTimes />
          </button>
          
          {currentImageIndex > 0 && (
            <button 
              className="absolute left-6 text-white text-2xl p-3 hover:bg-white/10 rounded-full transition-colors"
              onClick={prevImage}
            >
              <FaArrowLeft />
            </button>
          )}
          
          <div className="relative">
            <img
              src={imageMessages[currentImageIndex]?.image}
              alt="preview"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-xl object-contain"
            />
          </div>
          
          {currentImageIndex < imageMessages.length - 1 && (
            <button 
              className="absolute right-6 text-white text-2xl p-3 hover:bg-white/10 rounded-full transition-colors"
              onClick={nextImage}
            >
              <FaArrowRight />
            </button>
          )}
          
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/80">
            {currentImageIndex + 1} / {imageMessages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;

/*
TODO LIST FOR FUTURE IMPROVEMENTS:

1. Implement actual file/document sharing functionality
   - Add file upload handler
   - Display different file types with appropriate icons
   - Show real counts for each file type

2. Voice message feature
   - Record audio functionality
   - Audio player component for playback
   - Storage and retrieval of voice messages

3. Link preview functionality
   - Parse URLs and show preview cards
   - Fetch metadata from shared links
   - Cache link previews

4. Mobile responsiveness improvements
   - Better touch targets for mobile
   - Swipe gestures for image gallery
   - Optimize modal for small screens

5. Performance optimizations
   - Lazy load images
   - Virtualize long media lists
   - Implement caching for media

6. Additional features
   - Media download options
   - Search within shared media
   - Sort/filter options for files
   - Bulk actions for media

7. UI/UX enhancements
   - Loading states for media
   - Empty state illustrations
   - Animations for better transitions
   - Dark/light mode support
*/