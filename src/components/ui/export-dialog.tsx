import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [options, setOptions] = useState({
    includeRisks: true,
    includeCategories: true,
    includeProviders: true,
  });
  const [format, setFormat] = useState("pdf");

  const exportMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/export", data);
    },
    onSuccess: async (response) => {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-tools-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export complete",
        description: `Your data has been exported as ${format.toUpperCase()}.`,
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: `Failed to export data: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleExport = () => {
    exportMutation.mutate({
      startDate,
      endDate,
      options,
      format,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Export AI tools data for reporting and analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="block text-sm font-medium text-slate-700 mb-1">
              Date Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="date"
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <i className="ri-calendar-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>
              <div className="relative">
                <input
                  type="date"
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <i className="ri-calendar-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-slate-700 mb-1">
              Export Options
            </Label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox
                  id="includeRisks"
                  checked={options.includeRisks}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeRisks: !!checked })
                  }
                />
                <Label htmlFor="includeRisks" className="ml-2 text-sm">
                  Include risk assessment
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="includeCategories"
                  checked={options.includeCategories}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeCategories: !!checked })
                  }
                />
                <Label htmlFor="includeCategories" className="ml-2 text-sm">
                  Include categories
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="includeProviders"
                  checked={options.includeProviders}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeProviders: !!checked })
                  }
                />
                <Label htmlFor="includeProviders" className="ml-2 text-sm">
                  Include provider information
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-slate-700 mb-1">
              Format
            </Label>
            <RadioGroup
              value={format}
              onValueChange={setFormat}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="formatPDF" />
                <Label htmlFor="formatPDF">PDF Report</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="formatCSV" />
                <Label htmlFor="formatCSV">CSV Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xlsx" id="formatXLSX" />
                <Label htmlFor="formatXLSX">Excel</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? "Exporting..." : "Export Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
