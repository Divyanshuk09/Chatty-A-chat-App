import React, { useContext, useState } from "react";
import userpfp from "../assets/user_pfp.jpg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
const ProfilePage = () => {
  const {authUser, updateprofile} = useContext(AuthContext)
  // console.log("AUTHUSER:",authUser);

  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(authUser.profilePic);


  const navigate = useNavigate()
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log({ name, bio, image });

    const formData = new FormData();
    formData.append('fullName',name);
    formData.append('bio',bio);
    if (image instanceof File) {
      formData.append("profilePic",image);
    }
    await updateprofile(formData);
    navigate('/')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1f3b] text-white p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 p-6 rounded-lg shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>

        {/* Profile Image Upload */}
        <div className="relative flex flex-col items-center">
          <label htmlFor="profileImage" className="cursor-pointer relative">
            <img
              src={preview || userpfp}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-400"
            />
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-[1px] rounded">
              Edit
            </span>
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Name */}
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded bg-white/10 border border-gray-500 focus:outline-none"
        />

        {/* Bio */}
        <textarea
          placeholder="Short bio..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          style={{resize:"none"}}
          className="p-2 rounded bg-white/10 border border-gray-500 focus:outline-none"
        />

        {/* Save Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 transition py-2 px-4 rounded text-white font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
