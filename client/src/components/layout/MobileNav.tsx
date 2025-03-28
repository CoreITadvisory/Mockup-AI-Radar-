import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, Wrench, AlertTriangle, Settings } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 z-10 shadow-lg">
      <div className="flex justify-around">
        <Link href="/home">
          <a className={cn(
            "flex flex-col items-center py-2",
            isActive("/home") 
              ? "text-white bg-white/20 rounded-lg px-4" 
              : "text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 transition-all"
          )}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/dashboard">
          <a className={cn(
            "flex flex-col items-center py-2",
            isActive("/dashboard") 
              ? "text-white bg-white/20 rounded-lg px-4" 
              : "text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 transition-all"
          )}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
        <Link href="/tools">
          <a className={cn(
            "flex flex-col items-center py-2",
            isActive("/tools") 
              ? "text-white bg-white/20 rounded-lg px-4" 
              : "text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 transition-all"
          )}>
            <Wrench className="h-5 w-5" />
            <span className="text-xs mt-1">Tools</span>
          </a>
        </Link>
        <Link href="/risks">
          <a className={cn(
            "flex flex-col items-center py-2",
            isActive("/risks") 
              ? "text-white bg-white/20 rounded-lg px-4" 
              : "text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 transition-all"
          )}>
            <AlertTriangle className="h-5 w-5" />
            <span className="text-xs mt-1">Risks</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={cn(
            "flex flex-col items-center py-2",
            isActive("/settings") 
              ? "text-white bg-white/20 rounded-lg px-4" 
              : "text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 transition-all"
          )}>
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
