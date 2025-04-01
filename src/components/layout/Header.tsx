import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Menu, Download, Bell } from "lucide-react";
import { useTheme } from "@/contexts/ToolsContext";

interface HeaderProps {
  hideLogo?: boolean;
  pageTitle?: string;
}

export default function Header({ hideLogo = false, pageTitle = "Dashboard" }: HeaderProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {!hideLogo && (
          <Link href="/" className="flex items-center gap-2 text-white">
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#06B6D4]" // Tailwind's cyan-500 color for the turquoise
            >
              <path
                d="M16 2L28 8V24L16 30L4 24V8L16 2Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 8L16 12M16 12L12 16M16 12L20 16M12 16L16 20M20 16L16 20M16 20L16 24"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="16" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="16" r="2" fill="currentColor" />
              <circle cx="20" cy="16" r="2" fill="currentColor" />
              <circle cx="16" cy="20" r="2" fill="currentColor" />
            </svg>
            <span className="text-xl font-bold">AI Guard</span>
          </Link>
        )}
        
        {pageTitle && (
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2.5 h-[42px] w-[42px]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button
            variant="default"
            className="bg-white hover:bg-white/90 text-blue-600 px-5 py-2.5 h-[42px] rounded-xl flex items-center gap-2.5 shadow-md transition-all"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download className="h-5 w-5" />
            <span className="hidden md:inline text-sm font-medium">Export</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2.5 h-[42px] w-[42px] transition-colors"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <ExportDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen} />
    </header>
  );
}

