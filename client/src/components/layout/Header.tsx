import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Menu, Download } from "lucide-react";
import { useTheme } from "@/contexts/ToolsContext";

export default function Header() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleToggleSidebar = () => {
    // This would be implemented if we needed to toggle the sidebar on mobile
    toast({
      title: "Mobile menu",
      description: "Mobile menu functionality would be implemented here",
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <button
          className="md:hidden mr-3 text-slate-500"
          onClick={handleToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search AI tools..."
            className="pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
          />
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 rounded-lg hover:bg-slate-100" aria-label="Notifications">
            <i className="ri-notification-3-line text-slate-500"></i>
          </button>
          <Button
            variant="default"
            className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-700"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Export</span>
          </Button>
          <Button
            variant="outline" 
            size="icon"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
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
