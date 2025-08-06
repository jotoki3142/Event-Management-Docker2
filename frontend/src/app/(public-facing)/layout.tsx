import Footer from "@/components/Footer";
//import "./globals.css";
import Header from '@/components/Header';
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: 'Event Management',
  description: 'Trang quản lý sự kiện',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* External CDN links for icons */}
        <link
          rel="stylesheet"
          href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        <UserProvider>
          <div className="page-wrapper">
            <Header />
              <main className="main-content-global">{children}</main>
            <Footer />
          </div>
        </UserProvider>
      </body>
  </html>
  );
}
