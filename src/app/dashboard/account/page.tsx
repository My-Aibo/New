"use client";

import React, { useState } from "react";
import AppearanceTab from "@/app/components/organisms/tabs/apprance-tab/apprance-tab";
import AccountTab from "@/app/components/organisms/tabs/account-tab/AccountTab";
import Headline from "@/app/components/atoms/headline/Headline";
import ProfileTab from "@/app/components/organisms/tabs/profile-tab/ProfileTab";
import SecurityTab from "@/app/components/organisms/tabs/security-tab/SecurityTab";
import { TABS } from "@/lib/constants/accountTabs";

const Account = () => {
  type TabKeys = keyof typeof tabInfo;
  const [activeTab, setActiveTab] = useState<TabKeys>("Account");

  const tabInfo = {
    Account: {
      title: "Account Settings",
      description: "Manage your account and connected wallet.",
    },
    Profile: {
      title: "Profile Settings",
      description:
        "Update your username, profile picture and other personal info.",
    },
    Appearance: {
      title: "Appearance Settings",
      description: "Customize the look and feel of your app.",
    },
    Security: {
      title: "Security Settings",
      description: "Manage your sessions, logins and security settings.",
    },
  };

  return (
    <div className="mx-auto px-6 border-white/10 border rounded-xl p-10 backdrop-blur-sm ">
      {/* Page Headline */}
      <Headline title="Settings" />

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabKeys)}
            className={`text-sm font-medium px-4 py-2 rounded-md transition-all ${
              activeTab === tab
                ? "bg-[#94EFEB]/10 rounded-full text-[#94EFEB]"
                : "text-gray-400 hover:text-dynamic hover:bg-[#94EFEB]/10 cursor-pointer"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Tab Info */}
      <div className="py-10">
        <div className="border-b border-[#2a2a2a] pb-6">
          <div className="flex gap-10 items-start py-3">
            <div className="min-w-[300px]">
              <h3 className="text-dynamic font-sans text-md">
                {tabInfo[activeTab].title}
              </h3>
              <p className="text-gray-400 text-sm">
                {tabInfo[activeTab].description}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-6">
          {activeTab === "Account" && <AccountTab />}
          {activeTab === "Profile" && <ProfileTab />}
          {activeTab === "Appearance" && <AppearanceTab />}
          {activeTab === "Security" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
};

export default Account;
