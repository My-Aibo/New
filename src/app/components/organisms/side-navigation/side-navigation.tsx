"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Layers,
  User,
  Bell,
  Settings,
  ChevronRight,
  ChevronLeft,
  Home,
  BarChart2,
  CreditCard,
  FileText,
  Mail,
  Bitcoin,
  CheckCircle,
  Phone,
  Activity,
  Heart,
  PhoneCall,
  Wifi,
  Wallet,
  Sun,
  Shield,
  PieChart, // for Portfolio
  AlertCircle, // for Alerts
  BookOpen, // for Market News
  Twitter, // for Connect links
  Instagram, // for Connect links
  Link as LinkIcon, // for Docs
  ShoppingCart,
  ArrowUpRight, // for Buy Token
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAppearanceStore } from "@/lib/store/useAppearanceStore";

type SectionKey = "dashboard" | "tools" | "account";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const NAV_CONFIG: Record<SectionKey, NavItem[]> = {
  dashboard: [
    { name: "Home", icon: <Home className="h-4 w-4" /> },
    { name: "Portfolio", icon: <PieChart className="h-4 w-4" /> },
    { name: "Analytics", icon: <BarChart2 className="h-4 w-4" /> },
    { name: "Transactions", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Documentation", icon: <FileText className="h-4 w-4" /> },
    { name: "Alerts", icon: <AlertCircle className="h-4 w-4" /> },
    { name: "Market News", icon: <BookOpen className="h-4 w-4" /> },
  ],
  tools: [
    { name: "Crypto Operator", icon: <Bitcoin className="h-4 w-4" /> },
    { name: "Email Operator", icon: <Mail className="h-4 w-4" /> },
    { name: "Smart Home Operator", icon: <Home className="h-4 w-4" /> },
    { name: "Order Confirmation", icon: <CheckCircle className="h-4 w-4" /> },
    { name: "Call Operator", icon: <Phone className="h-4 w-4" /> },
    { name: "Health Operator", icon: <Activity className="h-4 w-4" /> },
    { name: "Lifestyle Operator", icon: <Heart className="h-4 w-4" /> },
    { name: "Telefon Operator", icon: <PhoneCall className="h-4 w-4" /> },
    { name: "IoT Operator", icon: <Wifi className="h-4 w-4" /> },
  ],
  account: [
    { name: "Account", icon: <Wallet className="h-4 w-4" /> },
    { name: "Profile", icon: <User className="h-4 w-4" /> },
    { name: "Appearance", icon: <Sun className="h-4 w-4" /> },
    { name: "Security", icon: <Shield className="h-4 w-4" /> },
  ],
};

// external links footer
const CONNECT_LINKS: { name: string; icon: React.ReactNode; href: string }[] = [
  {
    name: "Community",
    icon: <ArrowUpRight className="h-4 w-4" />,
    href: "https://twitter.com/yourhandle",
  },
  {
    name: "Follow us on Instagram",
    icon: <Instagram className="h-4 w-4" />,
    href: "https://instagram.com/yourhandle",
  },
  {
    name: "Read Docs on GitBook",
    icon: <LinkIcon className="h-4 w-4" />,
    href: "https://aibo.gitbook.io/aibo",
  },
  {
    name: "Buy Token",
    icon: <ShoppingCart className="h-4 w-4" />,
    href: "https://yourtoken.sale",
  },
];

interface ISideNavigationProps {
  selectedItem?: string;
  onSelectItem?: (item: string) => void;
}

export default function SideNavigation({
  selectedItem,
  onSelectItem = () => {},
}: ISideNavigationProps) {
  const [showMainSidebar, setShowMainSidebar] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const { theme } = useAppearanceStore();

  const sections: { key: SectionKey; icon: React.ReactNode }[] = [
    { key: "dashboard", icon: <LayoutGrid size={20} /> },
    { key: "tools", icon: <Layers size={20} /> },
    { key: "account", icon: <User size={20} /> },
  ];

  const navItems = NAV_CONFIG[activeSection];

  return (
    <div className="flex h-screen sticky top-0 z-50 pt-5">
      {/* icon‐only sidebar */}
      <div
        className={cn(
          "flex w-16 flex-col items-center m-2 p-2 bg-transparent rounded-3xl backdrop-blur-xs border",
          theme === "Dark" ? "border-white/10" : "border-black/10"
        )}
      >
        {/* logo */}
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded border border-white/10 backdrop-blur-sm">
          <Image
            src="https://aibo.gitbook.io/~gitbook/image?url=https%3A%2F%2F1316619439-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FiA3GcixW1c4Yq6OU5kX4%252Fsites%252Fsite_FuIKp%252Ficon%252FyEsVvyXQVXBPQ5Xrwh1p%252F1_Logo.png%3Falt%3Dmedia%26token%3D12387ea3-b836-4cd8-aaac-1ce4cb1b8bb6&width=32&dpr=2&quality=100&sign=a9fef99&sv=2"
            alt="logo-aibo"
            width={32}
            height={32}
            priority
          />
        </div>

        {/* section icons */}
        <div className="flex flex-col items-center space-y-6">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              className={cn(
                "p-1 rounded-md transition cursor-pointer",
                activeSection === sec.key ? "bg-white/10" : "hover:bg-white/10"
              )}
            >
              {sec.icon}
            </button>
          ))}
        </div>

        {/* collapse + utility icons */}
        <div className="mt-auto flex flex-col items-center space-y-6 py-6">
          <button
            onClick={() => setShowMainSidebar((p) => !p)}
            className="rounded-md p-1 hover:bg-white/10 transition cursor-pointer"
          >
            {showMainSidebar ? (
              <ChevronLeft className="text-dynamic" size={20} />
            ) : (
              <ChevronRight className="text-dynamic" size={20} />
            )}
          </button>
          <Bell className="text-dynamic cursor-pointer" size={20} />
          <Settings className="text-dynamic cursor-pointer" size={20} />
        </div>
      </div>

      {/* main sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out bg-transparent rounded-3xl backdrop-blur-xs border m-2 flex flex-col",
          "transition-all duration-300 ease-in-out bg-transparent rounded-3xl backdrop-blur-xs border m-2 flex flex-col overflow-hidden",
          theme === "Dark" ? "border-white/10" : "border-black/10",
          showMainSidebar
            ? "w-64 opacity-100 translate-x-0"
            : "w-0 opacity-0 -translate-x-4 pointer-events-none"
        )}
      >
        {/* header */}
        <div className="backdrop-blur-lg border-b border-white/10 px-6 py-2 bg-transparent">
          <div className="flex items-center space-x-2">
            <Image
              src="https://aibo.gitbook.io/~gitbook/image?url=https%3A%2F%2F1316619439-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FiA3GcixW1c4Yq6OU5kX4%252Fsites%252Fsite_FuIKp%252Ficon%252FyEsVvyXQVXBPQ5Xrwh1p%252F1_Logo.png%3Falt%3Dmedia%26token%3D12387ea3-b836-4cd8-aaac-1ce4cb1b8bb6&width=32&dpr=2&quality=100&sign=a9fef99&sv=2"
              alt="Logo"
              width={32}
              height={32}
              priority
            />
            <div>
              <h1 className="text-sm text-[#94efeb] font-bold">aibo.</h1>
              <p className="text-xs text-gray-400">support@aibo.com</p>
            </div>
          </div>
        </div>

        {/* dynamic nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => onSelectItem(item.name)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-dynamic transition",
                "cursor-pointer hover:bg-white/10",
                selectedItem === item.name && "bg-white/10"
              )}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* connect-with-us footer */}
        {/* after your <nav> … </nav> */}
        <div className="px-3 py-4 space-y-2">
          <p className="text-xs text-gray-400 uppercase">Connect with us</p>
          {CONNECT_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-dynamic hover:bg-white/10 transition cursor-pointer"
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
