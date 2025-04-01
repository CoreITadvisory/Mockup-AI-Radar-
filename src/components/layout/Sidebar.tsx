import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
};

interface SidebarProps {
  activePage?: string;
}

function NavItem({ href, icon, label, isActive = false, isCollapsed = false }: NavItemProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
          isActive
            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
            : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
        )}
      >
        <i className={cn(icon, "text-lg")} />
        {!isCollapsed && <span>{label}</span>}
      </a>
    </Link>
  );
}

export default function Sidebar({ activePage = "" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full shadow-sm transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="bg-blue-600 dark:bg-blue-800 h-[72px] px-6 flex items-center justify-between">
        <div className={cn("flex items-center", isCollapsed ? "justify-center w-full" : "gap-4")}>
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-lg p-2.5 w-14 h-14 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-transparent"
            >
              <path
                d="M16 2L28 8V24L16 30L4 24V8L16 2Z"
                stroke="url(#logo-stroke)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 8L16 12M16 12L12 16M16 12L20 16M12 16L16 20M20 16L16 20M16 20L16 24"
                stroke="url(#logo-stroke)"
                strokeWidth="2"
              />
              <circle cx="16" cy="12" r="2" fill="url(#logo-fill)" />
              <circle cx="12" cy="16" r="2" fill="url(#logo-fill)" />
              <circle cx="20" cy="16" r="2" fill="url(#logo-fill)" />
              <circle cx="16" cy="20" r="2" fill="url(#logo-fill)" />
              <defs>
                <linearGradient id="logo-stroke" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#A855F7" />
                </linearGradient>
                <linearGradient id="logo-fill" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-semibold text-white leading-tight">AI Guard</h1>
              <p className="text-sm text-white/80 mt-0.5">AI Tool Security Monitoring</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <NavItem
          href="/home"
          icon="ri-home-line"
          label="Home"
          isActive={activePage === "home"}
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/dashboard"
          icon="ri-dashboard-line"
          label="Dashboard"
          isActive={activePage === "dashboard"}
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/tools"
          icon="ri-tools-line"
          label="AI Tools"
          isActive={activePage === "tools"}
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/risks"
          icon="ri-alert-line"
          label="Risk Assessment"
          isActive={activePage === "risks"}
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/settings"
          icon="ri-settings-line"
          label="Settings"
          isActive={activePage === "settings"}
          isCollapsed={isCollapsed}
        />

        {!isCollapsed && (
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="px-3 text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">Sources</p>
            <div className="mt-2 space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50/50 text-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/20 transition-colors">
                <i className="ri-github-fill text-xl text-slate-800 dark:text-slate-200"></i>
                <span>GitHub</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50/50 text-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/20 transition-colors">
                <i className="ri-product-hunt-line text-xl text-slate-800 dark:text-slate-200"></i>
                <span>Product Hunt</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50/50 text-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/20 transition-colors">
                <i className="ri-twitter-x-line text-xl text-slate-800 dark:text-slate-200"></i>
                <span>Twitter/X</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50/50 text-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/20 transition-colors">
                <i className="ri-reddit-line text-xl text-slate-800 dark:text-slate-200"></i>
                <span>Reddit</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
              <i className="ri-user-line text-white"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Security Team</p>
            </div>
            <button className="ml-auto p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <i className="ri-logout-box-line text-sm"></i>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
