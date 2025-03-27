import { Link, useLocation } from "wouter";
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
          "flex items-center space-x-3 px-3 py-2 rounded-lg",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "hover:bg-slate-100 text-slate-700"
        )}
      >
        <i className={`${icon} text-xl`}></i>
        <span>{label}</span>
      </a>
    </Link>
  );
};

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
            <Shield className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">AI Guard</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">AI Tool Security Monitoring</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <NavItem
          href="/dashboard"
          icon="ri-dashboard-line"
          label="Dashboard"
          isActive={location === "/dashboard"}
        />
        <NavItem
          href="/tools"
          icon="ri-tools-line"
          label="AI Tools"
          isActive={location === "/tools"}
        />
        <NavItem
          href="/risks"
          icon="ri-alert-line"
          label="Risk Assessment"
          isActive={location === "/risks"}
        />
        <NavItem
          href="/settings"
          icon="ri-settings-line"
          label="Settings"
          isActive={location === "/settings"}
        />

        <div className="pt-4 mt-4 border-t border-slate-200">
          <p className="px-3 text-xs font-medium text-slate-500 uppercase">Sources</p>
          <div className="mt-2 space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
              <i className="ri-github-fill text-xl"></i>
              <span>GitHub</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
              <i className="ri-product-hunt-line text-xl"></i>
              <span>Product Hunt</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
              <i className="ri-twitter-x-line text-xl"></i>
              <span>Twitter/X</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
              <i className="ri-reddit-line text-xl"></i>
              <span>Reddit</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <i className="ri-user-line text-blue-600"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-slate-500">Security Team</p>
          </div>
          <button className="ml-auto text-slate-400 hover:text-slate-600">
            <i className="ri-logout-box-line"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
