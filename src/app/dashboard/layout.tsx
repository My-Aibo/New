import "../../app/globals.css";
import AppWrapper from "../components/templates/app-wrapper/app-wrapper";
import SideNavigation from "../components/organisms/side-navigation/side-navigation";
import Header from "../components/organisms/header/Header";
import CommandMenu from "../components/organisms/command-menu/command-menu";
import { ThemeProvider } from "../components/templates/theme-provider/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'Dark' || (theme === 'System' && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="h-full bg-white text-black dark:bg-black dark:text-white"
      >
        <AppWrapper>
          <ThemeProvider>
            <div className="h-full min-h-screen flex flex-row">
              <SideNavigation />
              <div className="flex flex-col flex-1 h-full">
                <Header />
                <main className="flex-1 overflow-y-auto p-5">{children}</main>
              </div>
            </div>
            <CommandMenu />
          </ThemeProvider>
        </AppWrapper>
      </body>
    </html>
  );
}
