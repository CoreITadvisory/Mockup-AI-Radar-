import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Wrench, AlertTriangle, Settings } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-10">
      <div className="flex justify-around">
        <Link href="/dashboard">
          <a className={cn(
            "flex flex-col items-center py-2",
            isActive("/dashboard") ? "text-blue-600" : "text-slate-600"
          )}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
        <Link href="/tools">
          <a className={cn(
            "flex flex-col items-center py-2",
            isActive("/tools") ? "text-blue-600" : "text-slate-600"
          )}>
            <Wrench className="h-5 w-5" />
            <span className="text-xs mt-1">Tools</span>
          </a>
        </Link>
        <Link href="/risks">
          <a className={cn(
            "flex flex-col items-center py-2",
            isActive("/risks") ? "text-blue-600" : "text-slate-600"
          )}>
            <AlertTriangle className="h-5 w-5" />
            <span className="text-xs mt-1">Risks</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={cn(
            "flex flex-col items-center py-2",
            isActive("/settings") ? "text-blue-600" : "text-slate-600"
          )}>
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
