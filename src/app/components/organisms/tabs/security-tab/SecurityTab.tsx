"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { shortenAddress } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Globe, Mail, MapPin, Monitor } from "lucide-react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const SecurityTab = () => {
  const { user, ready, authenticated } = usePrivy();
  const [lastLogin, setLastLogin] = useState<string>("");
  const [locationInfo, setLocationInfo] = useState<{
    city?: string;
    country?: string;
    ip?: string;
    lat?: number;
    lon?: number;
  }>({});
  const [deviceInfo, setDeviceInfo] = useState<string>("");

  useEffect(() => {
    if (authenticated) {
      const existingLogin = localStorage.getItem("lastLogin");
      if (!existingLogin) {
        const now = new Date().toISOString();
        localStorage.setItem("lastLogin", now);
        setLastLogin(now);
      } else {
        setLastLogin(existingLogin);
      }
    }
  }, [authenticated]);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) {
      setDeviceInfo("Mobile Device");
    } else {
      setDeviceInfo("Desktop Browser");
    }

    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipinfo.io/json?token=6e17ef9c4419e5");
        const data = await res.json();
        const [lat, lon] = data.loc.split(",");
        setLocationInfo({
          city: data.city,
          country: data.country,
          ip: data.ip,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        });
      } catch (error) {
        console.error("Failed to fetch location", error);
      }
    };

    fetchLocation();
  }, []);

  if (!ready) {
    return (
      <div className="space-y-10 text-dynamic">
        {/* Skeleton when loading */}
        <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
          <div className="min-w-[300px] space-y-2">
            <div className="w-32 h-4 bg-[#2a2a2a] rounded" />
            <div className="w-48 h-3 bg-[#2a2a2a] rounded" />
          </div>
          <div className="w-60 h-6 bg-[#2a2a2a] rounded" />
        </div>

        <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
          <div className="min-w-[300px] space-y-2">
            <div className="w-32 h-4 bg-[#2a2a2a] rounded" />
            <div className="w-48 h-3 bg-[#2a2a2a] rounded" />
          </div>
          <div className="w-48 h-6 bg-[#2a2a2a] rounded" />
        </div>

        <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
          <div className="min-w-[300px] space-y-2">
            <div className="w-32 h-4 bg-[#2a2a2a] rounded" />
            <div className="w-48 h-3 bg-[#2a2a2a] rounded" />
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xl">
            <div className="w-full h-60 bg-[#2a2a2a] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="text-dynamic">
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-dynamic">
      {/* Last Connected Wallet */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-sm">Last Connected Wallet</h3>
          <p className="text-gray-400 text-xs">
            The wallet you logged in with.
          </p>
        </div>
        <div className="text-dynamic text-sm underline">
          {shortenAddress(user?.wallet?.address as string) ||
            "No wallet connected"}
        </div>
      </div>

      {/* Login Method */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-sm">Login Method</h3>
          <p className="text-gray-400 text-xs">How you authenticated.</p>
        </div>
        <div className="flex items-center gap-2">
          {user.google && (
            <>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
                width={18}
                height={18}
                className="rounded-full"
              />
              Google
            </>
          )}
          {user.email && !user.google && (
            <>
              <Mail size={18} color="#94efeb" />
              Email
            </>
          )}
          {user.wallet && !user.google && !user.email && (
            <>
              <Image
                src="https://187760183-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MVOiF6Zqit57q_hxJYp%2Ficon%2FU7kNZ4ygz4QW1rUwOuTT%2FWhite%20Ghost_docs_nu.svg?alt=media&token=447b91f6-db6d-4791-902d-35d75c19c3d1"
                alt="Wallet"
                width={18}
                height={18}
                className="rounded-full"
              />
              Wallet
            </>
          )}
        </div>
      </div>

      {/* Last Login */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-sm">Last Login</h3>
          <p className="text-gray-400 text-xs">When you last connected.</p>
        </div>
        <div className="text-dynamic text-sm">
          {lastLogin
            ? formatDistanceToNow(new Date(lastLogin), { addSuffix: true })
            : "Unknown"}
        </div>
      </div>

      {/* Session Details with Map */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-sm">Session Details</h3>
          <p className="text-gray-400 text-xs">
            Your current device and location.
          </p>
        </div>
        <div className="flex flex-col gap-6 w-full max-w-xl">
          <div className="text-dynamic text-sm space-y-4">
            <div className="flex items-center gap-2">
              <Monitor size={18} color="#94efeb" />
              {deviceInfo}
            </div>
            <div className="flex items-center gap-2">
              <Globe size={18} color="#94efeb" />
              {locationInfo.ip || "Unknown"}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} color="#94efeb" />
              {locationInfo.city && locationInfo.country
                ? `${locationInfo.city}, ${locationInfo.country}`
                : "Unknown"}
            </div>
          </div>

          {locationInfo.lat && locationInfo.lon && (
            <MapContainer
              center={[locationInfo.lat, locationInfo.lon]}
              zoom={12}
              style={{
                height: "300px",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
              }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[locationInfo.lat, locationInfo.lon]}>
                <Popup>Is this your current session?</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>

      {/* Disconnect Button */}
      <div className="flex justify-end pt-6">
        <button
          disabled
          className="text-sm cursor-not-allowed text-red-500 border border-red-500 hover:bg-red-500 hover:text-dynamic transition px-4 py-2 rounded-md"
        >
          Disconnect Account
        </button>
      </div>
    </div>
  );
};

export default SecurityTab;
