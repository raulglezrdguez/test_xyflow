import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import RequireAuth from "@/components/RequireAuth";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const geist = localFont({
  src: "../public/fonts/Geist.ttf",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMono.ttf",
});

export const metadata: Metadata = {
  title: "Sharexam",
  description: "Professional community for sharing exams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${geistMono.className} antialiased`}>
        <AuthProvider>
          <RequireAuth>
            <div className="relative z-10 text-white">
              {children}
              <Toaster position="top-center" richColors duration={3000} />
            </div>
          </RequireAuth>
        </AuthProvider>
      </body>
    </html>
  );
}
