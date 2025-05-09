import AppWrapper from "../components/templates/app-wrapper/app-wrapper";
import "../../app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
