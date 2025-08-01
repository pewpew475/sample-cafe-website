import type { Metadata } from "next";
import "./globals.css";
import Navbar from '../components/navigation/navbar'
import Footer from '../components/footer/Footer'
import { RestaurantProvider } from '../context/RestaurantContext'
import { NotificationProvider } from '../context/NotificationContext'

export const metadata: Metadata = {
  title: "Sample Cafe Website",
  description: "Created by pratyush pushkar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <NotificationProvider>
          <RestaurantProvider>
            <Navbar/>
            {children}
            <Footer/>
          </RestaurantProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
