"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";

import { useAuthStore } from "@/store/user";
import { auth } from "@/lib/firebase/config";

function Header({}) {
  const path = usePathname();
  const { isAuthenticated, clearUser, getUserData } = useAuthStore();

  const userData = getUserData();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut(auth);
    clearUser();
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 text-nowrap">
      <div className="backdrop-blur-sm bg-white/10 border border-white/80 rounded-full px-8 py-3 flex items-center justify-between gap-8">
        <Link href={"/"} className="mr-10 md:mr20">
          <Image
            src="/logo.svg"
            alt="logo"
            className="min-w-12 object-cover"
            width={12}
            height={12}
          />
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            href={`/exams`}
            className="text-gray-800/80 font-medium transition-all duration-300 hover:text-green-800 hover:bg-amber-200/40 px-4 py-2 hover:rounded-2xl hover:border-gray-500/80 hover:border cursor-pointer"
          >
            Exams
          </Link>
          <Link
            href={`/patients`}
            className="text-gray-800/80 font-medium transition-all duration-300 hover:text-green-800 hover:bg-amber-200/40 px-4 py-2 hover:rounded-2xl hover:border-gray-500/80 hover:border cursor-pointer"
          >
            Patients
          </Link>
          <Link
            href={`/stats`}
            className="text-gray-800/80 font-medium transition-all duration-300 hover:text-green-800 hover:bg-amber-200/40 px-4 py-2 hover:rounded-2xl hover:border-gray-500/80 hover:border cursor-pointer"
          >
            Stats
          </Link>
        </div>

        {path !== `/login` &&
          (isAuthenticated && userData ? (
            <div className="relative" ref={menuRef}>
              {/* Menu trigger */}
              <button
                aria-haspopup="true"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((s) => !s)}
                className="flex items-center gap-3 px-3 py-1 rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-500 shrink-0"
              >
                {userData.photoURL ? (
                  <Image
                    src={userData.photoURL}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-sm text-white shrink-0">
                    {userData.displayName
                      ? userData.displayName.charAt(0)
                      : "U"}
                  </div>
                )}
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-black/80 backdrop-blur rounded-md border border-white/10 shadow-lg py-2 z-50">
                  <div className="px-4 py-2 flex items-center gap-3 border-b border-white/5 min-w-0">
                    {userData.photoURL ? (
                      <Image
                        src={userData.photoURL}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-sm text-white shrink-0">
                        {userData.displayName
                          ? userData.displayName.charAt(0)
                          : "U"}
                      </div>
                    )}
                    <div className="text-sm min-w-0">
                      <div className="font-medium truncate">
                        {userData.displayName || userData.email}
                      </div>
                      <div className="text-xs text-gray-300 truncate break-all">
                        {userData.email}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-800/60 hover:cursor-pointer text-sm bg-red-800/80"
                  >
                    Close session
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-10 md:ml-20">
              <Link
                href={`/login`}
                className="text-white font-medium transition-all duration-300 hover:text-green-600 cursor-pointer"
              >
                Auth
              </Link>
            </div>
          ))}
      </div>
    </header>
  );
}

export default Header;
