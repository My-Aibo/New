"use client";

import { useAppearanceStore } from "@/lib/store/useAppearanceStore";
import Image from "next/image";
import { useEffect, useState } from "react";

const AppearanceTab = () => {
  const { theme, setTheme } = useAppearanceStore();

  const [tempTheme, setTempTheme] = useState(theme);
  const [isEditing, setIsEditing] = useState(false);

  const interfaceOptions: {
    name: "System" | "Dark" | "Light";
    image: string;
  }[] = [
    { name: "System", image: "/assets/images/dark-img.png" },
    { name: "Light", image: "/assets/images/light-img.png" },
    { name: "Dark", image: "/assets/images/dark-img.png" },
  ];

  useEffect(() => {
    setTempTheme(theme);
  }, [theme]);

  const handleSave = () => {
    setTheme(tempTheme);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTheme(theme);
    setIsEditing(false);
  };

  const handleThemeChange = (newTheme: "System" | "Dark" | "Light") => {
    setTempTheme(newTheme);
    setIsEditing(true);
  };

  return (
    <div className="space-y-10 text-dynamic">
      {/* Interface Theme */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-sm font-sans">Interface Theme</h3>
          <p className="text-xs text-gray-400">
            Set your preferred theme to match your vibe.
          </p>
        </div>
        <div className="flex gap-4">
          {interfaceOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={() => handleThemeChange(opt.name)}
              className="text-left"
            >
              <Image
                src={opt.image}
                alt={`${opt.name} theme`}
                width={230}
                height={230}
                className={`rounded-md object-cover mb-2 ${
                  tempTheme === opt.name
                    ? "border-2 border-[#94efeb]"
                    : "border-2 border-[#2a2a2a]"
                }`}
              />
              <span className="text-sm">{opt.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-sm font-sans">Language</h3>
          <p className="text-xs text-gray-400">
            Choose your preferred language.
          </p>
        </div>
        <select className="bg-transparent text-dynamic border border-[#2a2a2a] min-w-sm rounded-md px-4 py-2">
          <option value="en-UK">English (UK)</option>
          <option value="en-US">English (US)</option>
          <option value="fr-FR">Français</option>
        </select>
      </div>

      {/* Brand Color */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-sm font-sans">Brand color</h3>
          <p className="text-xs text-gray-400">
            Select or customize your brand color.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-md border border-[#444] overflow-hidden flex items-center justify-center">
            <input
              type="color"
              value={"#94efeb"}
              onChange={() => {}}
              className="w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <input
            type="text"
            defaultValue={"#94efeb"}
            className="bg-transparent border border-[#2a2a2a] text-dynamic text-sm rounded-md px-3 py-1 w-28"
          />
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
            className="px-4 py-2 text-sm text-black bg-[#94efeb] rounded-md"
          >
            Save changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AppearanceTab;
