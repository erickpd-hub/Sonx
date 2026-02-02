import { Home, Music, Disc3, Sparkles, Upload, User, Download } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isDark: boolean;
  isPremium: boolean;
  isLoggedIn: boolean;
}

export function Sidebar({ isDark, isPremium, isLoggedIn }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: "/", icon: Home, label: "Inicio" },
    { path: "/music", icon: Music, label: "Música" },
    { path: "/beats", icon: Disc3, label: "Beats" },
    { path: "/samples", icon: Sparkles, label: "Samples Gratis" },
    { path: "/downloads", icon: Download, label: "Descargas" },
    { path: "/upload", icon: Upload, label: "Subir Contenido" },
    { path: "/profile", icon: User, label: "Mi Perfil" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex w-64 ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-r-4 ${isDark ? 'border-white' : 'border-black'} p-6 flex-col gap-6`}>
        {isLoggedIn && isPremium && (
          <div className={`bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} p-3`}>
            <p className="font-black text-black text-center">⭐ PREMIUM</p>
          </div>
        )}

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 border-4 ${isDark ? 'border-white' : 'border-black'} transition-all ${active
                    ? `bg-[var(--color-brutal-yellow)] translate-x-1 translate-y-1 ${isDark ? 'text-black' : 'text-black'}`
                    : `${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white text-black'} hover:translate-x-1 hover:translate-y-1 ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:shadow-none`
                  }`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-black">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {isLoggedIn && !isPremium && (
          <Link
            to="/subscription"
            className={`mt-auto bg-[var(--color-brutal-green)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-4 py-3`}
          >
            <p className="font-black text-black text-center">HAZTE PREMIUM</p>
            <p className="text-black text-center">$50 MXN/mes</p>
          </Link>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-t-4 ${isDark ? 'border-white' : 'border-black'} z-50`}>
        <div className="flex items-center justify-around px-2 py-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 ${active ? 'text-[var(--color-brutal-yellow)]' : isDark ? 'text-white' : 'text-black'
                  }`}
              >
                <Icon className={`w-6 h-6 ${active ? 'scale-110' : ''}`} />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}