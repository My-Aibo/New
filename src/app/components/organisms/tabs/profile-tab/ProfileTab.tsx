"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

const ProfileTab = () => {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("profileUsername") || "";
    const storedImage = localStorage.getItem("profileImage") || "";

    setUsername(storedUsername);
    setImage(storedImage);
  }, []);

  const handleSave = () => {
    localStorage.setItem("profileUsername", username);
    if (image) {
      localStorage.setItem("profileImage", image);
    }
    toast.success("Profile saved successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    const storedUsername = localStorage.getItem("profileUsername") || "";
    const storedImage = localStorage.getItem("profileImage") || "";
    setUsername(storedUsername);
    setImage(storedImage);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result.toString());
          localStorage.setItem("profileImage", reader.result.toString()); // 🔥 Save immediately
          setIsEditing(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage("");
    localStorage.removeItem("profileImage"); // 🔥 Remove from storage immediately
    setIsEditing(true);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setIsEditing(true);
  };

  return (
    <div className="space-y-10 text-dynamic">
      {/* Username */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-dynamic font-sans text-sm">
            Username <small className="text-gray-400 ml-2">(optional)</small>
          </h3>
          <p className="text-gray-400 text-xs">
            Your unique username for the platform. Must be lowercase, no spaces.
          </p>
        </div>
        <input
          className="bg-transparent text-dynamic border border-[#2a2a2a] min-w-sm rounded-md px-4 py-2"
          value={username}
          onChange={handleUsernameChange}
          placeholder="e.g. johndoe"
        />
      </div>

      {/* Profile Picture */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[380px]">
          <h3 className="text-dynamic font-sans text-sm">
            Profile Picture <small className="text-gray-400">(optional)</small>
          </h3>
          <p className="text-gray-400 text-xs">
            Upload a profile picture to personalize your account.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-md bg-gray-800 overflow-hidden flex items-center justify-center">
            <Image
              src={
                image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBC2UY2pAfFatruEETtg6IiIBgaLgdZuvRhX2q_jivxN7Aw-3ZqkVSYD832taq-6w8Dno&usqp=CAU"
              }
              alt="Profile"
              className="object-cover w-full h-full"
              width={96}
              height={96}
            />
          </div>
          <div className="flex gap-2">
            <label className="text-sm px-4 py-2 border border-gray-600 rounded-md cursor-pointer hover:border-white">
              Replace Image
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {image && (
              <button
                onClick={handleImageRemove}
                className="p-2 border border-gray-600 rounded-md hover:border-white transition"
              >
                <Trash2
                  size={18}
                  className="text-gray-400 hover:text-dynamic"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-400 border border-[#333] rounded-md hover:text-dynamic hover:border-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm text-black font-sans bg-[#94efeb] rounded-md"
          >
            Save changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
