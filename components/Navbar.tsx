import { useState } from "react";
import { Search, User, LogIn, Moon, Sun, LogOut, Bell, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavbarProps {
  isDark: boolean;
  isLoggedIn: boolean;
  user?: {
    username: string;
    avatar: string;
  };
  onLogout: () => void;
  onSearch: (query: string) => void;
  onToggleTheme: () => void;
}

import logoWhite from '../assets/logo-white.png';
import logoBlack from '../assets/logo-black.png';

export function Navbar({ isDark, isLoggedIn, user, onLogout, onSearch, onToggleTheme }: NavbarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <nav className={`h-20 ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-b-4 ${isDark ? 'border-white' : 'border-black'} px-4 md:px-6 flex items-center justify-between gap-3 md:gap-6 sticky top-0 z-40`}>
      {/* Logo - Hidden on mobile when search is open */}
      <Link to="/" className={`flex items-center gap-4 ${showMobileSearch ? 'hidden md:flex' : 'flex'}`}>
        <img
          src={isDark ? logoWhite : logoBlack}
          alt="BrutalBeats Logo"
          className="h-8 md:h-10 w-auto object-contain"
        />
      </Link>

      {/* Search Bar Container */}
      <div className={`flex-1 ${showMobileSearch ? 'flex' : 'hidden md:flex'} max-w-2xl items-center gap-2`}>
        <div className={`flex-1 flex items-center ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} brutal-shadow overflow-hidden`}>
          <input
            type="text"
            placeholder="Buscar..."
            onChange={(e) => onSearch(e.target.value)}
            autoFocus={showMobileSearch}
            className={`flex-1 px-3 md:px-4 py-2 md:py-3 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white text-black'} font-black focus:outline-none placeholder:opacity-50 text-sm md:text-base w-full`}
          />
          <button className={`px-3 md:px-4 py-2 md:py-3 ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'} ${isDark ? 'text-white' : 'text-black'} border-l-4 ${isDark ? 'border-white' : 'border-black'} hover:bg-[var(--color-brutal-yellow)] hover:text-black transition-colors`}>
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Close Button for Mobile Search */}
        {showMobileSearch && (
          <button
            onClick={() => setShowMobileSearch(false)}
            className={`md:hidden p-2 ${isDark ? 'text-white' : 'text-black'}`}
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Mobile Search Toggle Button */}
      {!showMobileSearch && (
        <button
          onClick={() => setShowMobileSearch(true)}
          className={`md:hidden w-10 h-10 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white text-black'} border-4 ${isDark ? 'border-white' : 'border-black'} brutal-shadow flex items-center justify-center`}
        >
          <Search className="w-5 h-5" />
        </button>
      )}

      {/* Theme Toggle & User Actions - Hidden on mobile when search is open */}
      <div className={`items-center gap-2 md:gap-3 ${showMobileSearch ? 'hidden md:flex' : 'flex'}`}>
        <button
          onClick={onToggleTheme}
          className={`w-10 h-10 md:w-12 md:h-12 ${isDark ? 'bg-[var(--color-brutal-yellow)]' : 'bg-[var(--color-dark-bg)]'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center`}
        >
          {isDark ? <Sun className="w-5 h-5 text-black" /> : <Moon className="w-5 h-5 text-white" />}
        </button>

        {isLoggedIn && (
          <Link
            to="/notifications"
            className={`w-10 h-10 md:w-12 md:h-12 ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white text-black'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center`}
          >
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
        )}

        {isLoggedIn && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 ${isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all outline-none`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 border-2 ${isDark ? 'border-white' : 'border-black'}`}>
                  <ImageWithFallback
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`font-black hidden md:block ${isDark ? 'text-white' : 'text-black'}`}>
                  {user.username}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-56 ${isDark ? 'bg-[var(--color-dark-surface)] border-white text-white' : 'bg-white border-black text-black'} border-4 brutal-shadow-lg rounded-none mt-2`}>
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className={`cursor-pointer flex items-center gap-2 p-3 font-bold hover:bg-[var(--color-brutal-yellow)] hover:text-black focus:bg-[var(--color-brutal-yellow)] focus:text-black transition-colors`}
                >
                  <User className="w-4 h-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onLogout}
                className={`cursor-pointer flex items-center gap-2 p-3 font-bold hover:bg-[var(--color-brutal-red)] hover:text-black focus:bg-[var(--color-brutal-red)] focus:text-black transition-colors`}
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/login"
            className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black text-black text-sm md:text-base`}
          >
            <LogIn className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:block">INICIAR SESIÓN</span>
          </Link>
        )}
      </div>
    </nav>
  );
}