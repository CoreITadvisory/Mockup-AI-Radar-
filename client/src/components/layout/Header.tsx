import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Menu, Download, Shield } from "lucide-react";
import { useTheme } from "@/contexts/ToolsContext";

export default function Header() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [location] = useLocation();

  const handleToggleSidebar = () => {
    // This would be implemented if we needed to toggle the sidebar on mobile
    toast({
      title: "Mobile menu",
      description: "Mobile menu functionality would be implemented here",
    });
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
      <div className="flex items-center">
        <button
          className="md:hidden mr-3 text-white"
          onClick={handleToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/home">
          <a className="flex items-center space-x-2 mr-5 hover:opacity-80 transition-opacity">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-1.5 shadow-sm">
              <Shield className="text-blue-600 dark:text-blue-400 h-4 w-4" />
            </div>
            <span className="text-lg font-semibold text-white">AI Guard</span>
          </a>
        </Link>
        <h1 className="text-xl font-semibold hidden xs:block text-white">
          {location === "/home" ? "Home" : 
           location === "/dashboard" ? "Dashboard" : 
           location === "/tools" ? "AI Tools" : 
           location === "/risks" ? "Risk Assessment" : 
           location === "/settings" ? "Settings" : "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search AI tools..."
            className="pl-9 pr-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent w-64 bg-white/20 text-white placeholder-white/70"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white" aria-label="Notifications">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <Button
            variant="default"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-50 shadow-sm"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Export</span>
          </Button>
          <Button
            variant="outline" 
            size="icon"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <ExportDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen} />
    </header>
  );
}
