import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import ToolCard from "@/components/tools/ToolCard";
import { RiskLevel, Category, Source, Status, AITool } from "@/types";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    riskLevel: "all",
    category: "all",
    source: "all",
    date: "",
  });

  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useQuery<{
    newTools: number;
    highRiskTools: number;
    pendingReview: number;
    approvedTools: number;
  }>({
    queryKey: ["/api/tools/stats"],
  });

  const {
    data: tools,
    isLoading: isToolsLoading,
    refetch: refetchTools,
  } = useQuery<AITool[]>({
    queryKey: ["/api/tools", filters],
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoadMore = () => {
    // This would handle pagination
    refetchTools();
  };

  return (
    <div className="p-4 md:p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isStatsLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-5 border border-slate-200"
              >
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-8 w-16 mb-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
        ) : (
          <>
            <StatCard
              title="New AI Tools Today"
              value={stats?.newTools || 0}
              icon="ri-sparkles-line"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              change={{
                value: 28,
                isPositive: true,
                text: "vs. yesterday",
              }}
            />
            <StatCard
              title="High Risk Tools"
              value={stats?.highRiskTools || 0}
              icon="ri-alert-line"
              iconBg="bg-red-100"
              iconColor="text-red-600"
              valueColor="text-red-500"
              change={{
                value: 12,
                isPositive: true,
                text: "vs. yesterday",
                showPositiveAsNegative: true,
              }}
            />
            <StatCard
              title="Pending Review"
              value={stats?.pendingReview || 0}
              icon="ri-timer-line"
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
              valueColor="text-orange-500"
              hint="Requires attention"
            />
            <StatCard
              title="Approved Tools"
              value={stats?.approvedTools || 0}
              icon="ri-check-double-line"
              iconBg="bg-green-100"
              iconColor="text-green-600"
              valueColor="text-green-500"
              change={{
                value: 3,
                isPositive: true,
                text: "this week",
              }}
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-4 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="relative mb-3 md:mb-0">
            <Select
              value={filters.riskLevel}
              onValueChange={(value) => handleFilterChange("riskLevel", value)}
            >
              <SelectTrigger className="pl-8 w-full md:w-auto">
                <i className="ri-shield-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <SelectValue placeholder="All Risk Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value={RiskLevel.HIGH}>High Risk</SelectItem>
                <SelectItem value={RiskLevel.MEDIUM}>Medium Risk</SelectItem>
                <SelectItem value={RiskLevel.LOW}>Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative mb-3 md:mb-0">
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="pl-8 w-full md:w-auto">
                <i className="ri-folder-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={Category.TEXT}>Text Generation</SelectItem>
                <SelectItem value={Category.IMAGE}>Image Generation</SelectItem>
                <SelectItem value={Category.VOICE}>Voice Synthesis</SelectItem>
                <SelectItem value={Category.CODING}>Coding Assistant</SelectItem>
                <SelectItem value={Category.DATA}>Data Processing</SelectItem>
                <SelectItem value={Category.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative mb-3 md:mb-0">
            <Select
              value={filters.source}
              onValueChange={(value) => handleFilterChange("source", value)}
            >
              <SelectTrigger className="pl-8 w-full md:w-auto">
                <i className="ri-global-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value={Source.GITHUB}>GitHub</SelectItem>
                <SelectItem value={Source.PRODUCT_HUNT}>Product Hunt</SelectItem>
                <SelectItem value={Source.TWITTER}>Twitter/X</SelectItem>
                <SelectItem value={Source.REDDIT}>Reddit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative mb-3 md:mb-0">
            <div className="relative">
              <input
                type="date"
                className="pl-8 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
              <i className="ri-calendar-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <button className="text-slate-500 hover:text-slate-700" title="View as grid">
              <i className="ri-grid-line text-xl"></i>
            </button>
            <button className="text-blue-600" title="View as list">
              <i className="ri-list-check text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Latest AI Tools</h2>

        {isToolsLoading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <Skeleton className="w-12 h-12 rounded-lg mr-4" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                  </div>
                  <Skeleton className="h-24 rounded-lg mt-4" />
                  <div className="mt-4 flex justify-between">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-48" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tools && tools.length > 0 ? (
              tools.map((tool: AITool) => <ToolCard key={tool.id} tool={tool} />)
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <p className="text-slate-500">No AI tools match your filters.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="flex items-center justify-center px-4 py-2"
            onClick={handleLoadMore}
            disabled={isToolsLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Load More
          </Button>
        </div>
      </div>

      <ExportDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen} />
    </div>
  );
}
