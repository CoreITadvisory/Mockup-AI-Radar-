import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AITool, RiskLevel, Status } from "@shared/schema";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Check, Ban } from "lucide-react";

type ToolCardProps = {
  tool: AITool;
};

export default function ToolCard({ tool }: ToolCardProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const updateToolStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "approved" | "blocked";
    }) => {
      return await apiRequest("PATCH", `/api/tools/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tools/stats"] });
      toast({
        title: "Tool updated",
        description: "The tool status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update tool: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    updateToolStatus.mutate({ id: tool.id, status: "approved" });
  };

  const handleBlock = () => {
    updateToolStatus.mutate({ id: tool.id, status: "blocked" });
  };

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case RiskLevel.HIGH:
        return (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
            High Risk
          </span>
        );
      case RiskLevel.MEDIUM:
        return (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">
            Medium Risk
          </span>
        );
      case RiskLevel.LOW:
        return (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
            Low Risk
          </span>
        );
      default:
        return null;
    }
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "text":
        return "ri-ai-generate";
      case "image":
        return "ri-image-line";
      case "voice":
        return "ri-mic-line";
      case "coding":
        return "ri-code-box-line";
      case "data":
        return "ri-database-2-line";
      default:
        return "ri-apps-line";
    }
  };

  const getIconBgForCategory = (category: string) => {
    switch (category) {
      case "text":
        return "bg-blue-100";
      case "image":
        return "bg-purple-100";
      case "voice":
        return "bg-orange-100";
      case "coding":
        return "bg-green-100";
      case "data":
        return "bg-yellow-100";
      default:
        return "bg-slate-100";
    }
  };

  const getIconColorForCategory = (category: string) => {
    switch (category) {
      case "text":
        return "text-blue-600";
      case "image":
        return "text-purple-600";
      case "voice":
        return "text-orange-600";
      case "coding":
        return "text-green-600";
      case "data":
        return "text-yellow-600";
      default:
        return "text-slate-600";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "github":
        return "ri-github-fill";
      case "producthunt":
        return "ri-product-hunt-line";
      case "twitter":
        return "ri-twitter-x-line";
      case "reddit":
        return "ri-reddit-line";
      default:
        return "ri-global-line";
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSecurityAssessmentBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case RiskLevel.HIGH:
        return "bg-red-50";
      case RiskLevel.MEDIUM:
        return "bg-orange-50";
      case RiskLevel.LOW:
        return "bg-green-50";
      default:
        return "bg-slate-50";
    }
  };

  const getSecurityAssessmentTextColor = (riskLevel: string) => {
    switch (riskLevel) {
      case RiskLevel.HIGH:
        return "text-red-700";
      case RiskLevel.MEDIUM:
        return "text-orange-700";
      case RiskLevel.LOW:
        return "text-green-700";
      default:
        return "text-slate-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mr-4",
                getIconBgForCategory(tool.category)
              )}
            >
              <i
                className={cn(
                  getIconForCategory(tool.category),
                  "text-xl",
                  getIconColorForCategory(tool.category)
                )}
              ></i>
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">{tool.name}</h3>
                {getRiskLevelBadge(tool.riskLevel)}
              </div>
              <p className="text-slate-500 text-sm">{tool.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">
              <i className={cn(getSourceIcon(tool.source), "mr-1")}></i>{" "}
              {tool.source.charAt(0).toUpperCase() + tool.source.slice(1)}
            </span>
            <span className="text-xs text-slate-500">
              {formatDate(tool.discoveredAt)}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-500 mb-1">PROVIDER</p>
            <p className="text-sm">{tool.provider}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-500 mb-1">CATEGORY</p>
            <p className="text-sm">
              {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-500 mb-1">
              ACCESS TYPE
            </p>
            <p className="text-sm">{tool.accessType}</p>
          </div>
        </div>

        <div
          className={cn(
            "mt-4 p-3 rounded-lg",
            getSecurityAssessmentBgColor(tool.riskLevel)
          )}
        >
          <p
            className={cn(
              "text-xs font-medium mb-1",
              getSecurityAssessmentTextColor(tool.riskLevel)
            )}
          >
            SECURITY ASSESSMENT
          </p>
          <ul
            className={cn(
              "text-sm space-y-1 pl-5 list-disc",
              getSecurityAssessmentTextColor(tool.riskLevel)
            )}
          >
            {(tool.securityAssessment as string[]).map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            {tool.websiteUrl && (
              <Button
                variant="outline"
                size="sm"
                className="mr-2 inline-flex items-center"
                onClick={() => window.open(tool.websiteUrl, "_blank")}
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Visit Website
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <FileText className="mr-1.5 h-4 w-4" />
              Full Report
            </Button>
          </div>

          <div className="flex items-center">
            {tool.status === Status.APPROVED ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-green-100 hover:bg-green-200 text-green-700"
                disabled
              >
                <Check className="mr-1 h-4 w-4" />
                Approved
              </Button>
            ) : tool.status === Status.BLOCKED ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-red-100 hover:bg-red-200 text-red-700"
                disabled
              >
                <Ban className="mr-1 h-4 w-4" />
                Blocked
              </Button>
            ) : (
              <>
                <span className="mr-2 text-sm text-slate-500">Mark as:</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-100 hover:bg-red-200 text-red-700"
                  onClick={handleBlock}
                  disabled={updateToolStatus.isPending}
                >
                  <Ban className="mr-1 h-4 w-4" />
                  Block
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 bg-slate-100 hover:bg-slate-200 text-slate-700"
                  onClick={handleApprove}
                  disabled={updateToolStatus.isPending}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
