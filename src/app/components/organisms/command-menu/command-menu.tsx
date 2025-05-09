"use client";

import { useState, useEffect } from "react";
import {
  Twitter,
  Instagram,
  BookOpen,
  ShoppingCart,
  LogOut,
  LineChart,
  Eye,
  Moon,
  ArrowRight,
} from "lucide-react";
import { useCommandMenuStore } from "@/lib/store/useCommandMenuStore";

const actions = [
  {
    name: "View Portfolio",
    icon: <Eye size={16} />,
    onClick: () => alert("Opening portfolio..."),
    section: "App",
  },
  {
    name: "View Analytics",
    icon: <LineChart size={16} />,
    onClick: () => alert("Showing analytics..."),
    section: "App",
  },
  {
    name: "Disconnect Wallet",
    icon: <LogOut size={16} />,
    onClick: () => alert("Wallet disconnected."),
    section: "App",
  },
  {
    name: "Toggle Dark Mode",
    icon: <Moon size={16} />,
    onClick: () => alert("Toggling theme..."),
    section: "App",
  },
  {
    name: "Follow us on Twitter",
    icon: <Twitter size={16} />,
    link: "https://twitter.com/yourhandle",
    section: "Social",
  },
  {
    name: "Follow us on Instagram",
    icon: <Instagram size={16} />,
    link: "https://instagram.com/yourhandle",
    section: "Social",
  },
  {
    name: "Read Docs on GitBook",
    icon: <BookOpen size={16} />,
    link: "https://yourproject.gitbook.io",
    section: "Social",
  },
  {
    name: "Buy Token",
    icon: <ShoppingCart size={16} />,
    link: "https://dexscreener.com/your-token",
    section: "Social",
  },
];

const CommandMenu: React.FC = () => {
  const [query, setQuery] = useState("");
  const { isOpen, toggleMenu, closeMenu } = useCommandMenuStore();

  const filtered = actions.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleMenu();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleMenu]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-40 z-[99]">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl w-full max-w-md p-4 shadow-xl">
        <input
          className="w-full bg-transparent outline-none text-dynamic placeholder-white/30 text-sm px-2 py-2 border-b border-[#2a2a2a]"
          placeholder="Type a command..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <div className="mt-4 space-y-4 max-h-72 overflow-y-auto">
          {filtered.some((a) => a.section === "App") && (
            <div>
              <div className="text-xs uppercase text-dynamic/30 px-3 mb-1">
                App Actions
              </div>
              {filtered
                .filter((a) => a.section === "App")
                .map((action, idx) => (
                  <button
                    key={idx}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-white/10 text-dynamic text-sm transition"
                    onClick={() => {
                      closeMenu();
                      action.onClick?.();
                    }}
                  >
                    <div className="text-[#94EFEB]">{action.icon}</div>
                    <span>{action.name}</span>
                    <ArrowRight size={14} className="ml-auto text-dynamic/20" />
                  </button>
                ))}
            </div>
          )}

          {filtered.some((a) => a.section === "Social") && (
            <div>
              <div className="text-xs uppercase text-dynamic/30 px-3 mb-1">
                Connect With Us
              </div>
              {filtered
                .filter((a) => a.section === "Social")
                .map((action, idx) => (
                  <a
                    key={idx}
                    href={action.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-white/10 text-dynamic text-sm transition"
                  >
                    <div className="text-[#94EFEB]">{action.icon}</div>
                    <span>{action.name}</span>
                    <ArrowRight size={14} className="ml-auto text-dynamic/20" />
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandMenu;
