import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
};

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all",
          isActive
            ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-l-4 border-blue-600"
            : "hover:bg-blue-50/50 text-slate-700 hover:text-blue-700"
        )}
      >
        <i className={`${icon} text-xl ${isActive ? 'text-blue-600' : ''}`}></i>
        <span>{label}</span>
      </a>
    </Link>
  );
};

type SidebarProps = {
  activePage?: string;
};

export default function Sidebar({ activePage = "" }: SidebarProps) {

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full shadow-sm">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 shadow-md">
            <Shield className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Guard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI Tool Security Monitoring</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <NavItem
          href="/home"
          icon="ri-home-line"
          label="Home"
          isActive={activePage === "home"}
        />
        <NavItem
          href="/dashboard"
          icon="ri-dashboard-line"
          label="Dashboard"
          isActive={activePage === "dashboard"}
        />
        <NavItem
          href="/tools"
          icon="ri-tools-line"
          label="AI Tools"
          isActive={activePage === "tools"}
        />
        <NavItem
          href="/risks"
          icon="ri-alert-line"
          label="Risk Assessment"
          isActive={activePage === "risks"}
        />
        <NavItem
          href="/settings"
          icon="ri-settings-line"
          label="Settings"
          isActive={activePage === "settings"}
        />

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
      </nav>

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
    </aside>
  );
}
