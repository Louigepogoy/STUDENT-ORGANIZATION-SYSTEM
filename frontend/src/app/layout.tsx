import type { Metadata } from "next";
import ApiBanner from "@/components/ApiBanner";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Organization System",
  description: "Manage student organizations, events, and memberships",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 font-sans">
        <Providers>
          <ApiBanner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
            Student Organization System &copy; {new Date().getFullYear()}
          </footer>
        </Providers>
      </body>
    </html>
  );
}
