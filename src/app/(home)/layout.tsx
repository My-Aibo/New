import { Metadata } from "next";
import AppWrapper from "../components/templates/app-wrapper/app-wrapper";
import "../../app/globals.css";
import { generateMetadata as genMeta } from "@/lib/utils/seo";

// Generate metadata for the home page
export const metadata: Metadata = genMeta({
  title: "Home",
  description: "Welcome to your next-generation crypto application",
  openGraph: {
    title: "Home | Your App Name",
    description: "Explore the future of crypto with our powerful and intuitive platform",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body cz-shortcut-listen="true">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
