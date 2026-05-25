"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, isOfficer, roleLabel } from "@/lib/auth-utils";

export default function Navbar() {
  const { user, logout, loading, ready } = useAuth();

  const showAuth = ready && !loading;
  const role = roleLabel(user);

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-indigo-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm">
            SOS
          </span>
          Student Org System
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
          <Link href="/organizations" className="hover:text-indigo-600">
            Organizations
          </Link>
          <Link href="/events" className="hover:text-indigo-600">
            Events
          </Link>
          <Link href="/announcements" className="hover:text-indigo-600">
            Announcements
          </Link>
          <Link href="/about" className="hover:text-indigo-600">
            About
          </Link>
          {user && (
            <Link href="/dashboard" className="hover:text-indigo-600">
              Dashboard
            </Link>
          )}
          {user && isOfficer(user) && (
            <Link href="/officer" className="hover:text-amber-700 text-amber-800">
              Officer Panel
            </Link>
          )}
          {user && isAdmin(user) && (
            <Link href="/admin/organizations" className="hover:text-indigo-600 font-semibold text-indigo-700">
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
           {showAuth && user ? (
             <>
               <span className="hidden text-sm text-slate-600 md:inline">
                 {roleLabel(user)} {user.name}
               </span>
               <button
                 type="button"
                 onClick={() => logout()}
                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
               >
                 Logout
               </button>
             </>
           ) : (
             <>
               <Link
                 href="/login"
                 className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
               >
                 Login
               </Link>
               <Link
                 href="/register"
                 className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
               >
                 Register
               </Link>
             </>
           )}
         </div>
      </div>
    </header>
  );
}
