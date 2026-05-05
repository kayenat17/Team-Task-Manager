import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TaskFlow | Work Reimagined",
  description: "The ultimate productivity OS for modern teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="plush-container">
          <img src="/plush-bolt.png" alt="" className="plush-bolt" />
        </div>
        <Providers>
          <Navbar />
          <div className="main-wrapper">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
