import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { AITool, RiskLevel, Status } from "@/types";
import { cn } from "@/lib/utils";
import { 
  ExternalLink, 
  FileText, 
  Check, 
  Ban, 
  AlertTriangle, 
  AlertCircle,
  Shield 
} from "lucide-react";

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
        return "bg-red-50 dark:bg-red-900/20";
      case RiskLevel.MEDIUM:
        return "bg-orange-50 dark:bg-orange-900/20";
      case RiskLevel.LOW:
        return "bg-green-50 dark:bg-green-900/20";
      default:
        return "bg-slate-50 dark:bg-slate-800";
    }
  };

  const getSecurityAssessmentTextColor = (riskLevel: string) => {
    switch (riskLevel) {
      case RiskLevel.HIGH:
        return "text-red-700 dark:text-red-400";
      case RiskLevel.MEDIUM:
        return "text-orange-700 dark:text-orange-400";
      case RiskLevel.LOW:
        return "text-green-700 dark:text-green-400";
      default:
        return "text-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
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
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <h3 className="text-lg font-semibold dark:text-white cursor-pointer hover:text-primary transition-colors duration-200">
                      {tool.name}
                    </h3>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="flex justify-between space-x-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        getIconBgForCategory(tool.category)
                      )}>
                        <i className={cn(
                          getIconForCategory(tool.category),
                          "text-xl",
                          getIconColorForCategory(tool.category)
                        )}></i>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{tool.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {tool.description}
                        </p>
                        <div className="flex items-center pt-1">
                          <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                            <i className={cn(getSourceIcon(tool.source), "mr-1")}></i>
                            {tool.source.charAt(0).toUpperCase() + tool.source.slice(1)}
                          </span>
                          <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full ml-2">
                            {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                {getRiskLevelBadge(tool.riskLevel)}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{tool.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              <i className={cn(getSourceIcon(tool.source), "mr-1")}></i>{" "}
              {tool.source.charAt(0).toUpperCase() + tool.source.slice(1)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(tool.discoveredAt)}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <p className="text-base font-bold text-black dark:text-white uppercase mb-2 border-b border-slate-300 dark:border-slate-600 pb-1" style={{color: 'inherit !important'}}>Provider</p>
            <p className="text-sm dark:text-slate-200">{tool.provider}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <p className="text-base font-bold text-black dark:text-white uppercase mb-2 border-b border-slate-300 dark:border-slate-600 pb-1" style={{color: 'inherit !important'}}>Category</p>
            <p className="text-sm dark:text-slate-200">
              {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <p className="text-base font-bold text-black dark:text-white uppercase mb-2 border-b border-slate-300 dark:border-slate-600 pb-1" style={{color: 'inherit !important'}}>
              Access Type
            </p>
            <p className="text-sm dark:text-slate-200">{tool.accessType}</p>
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
              "text-base font-bold uppercase mb-2 border-b pb-1",
              getSecurityAssessmentTextColor(tool.riskLevel)
            )}
          >
            Security Assessment
          </p>
          <ul
            className={cn(
              "text-sm space-y-2 pl-0 list-none",
              getSecurityAssessmentTextColor(tool.riskLevel)
            )}
          >
            {(tool.securityAssessment as string[]).map((risk, index) => (
              <li key={index} className="flex items-start">
                {tool.riskLevel === RiskLevel.HIGH ? (
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                ) : tool.riskLevel === RiskLevel.MEDIUM ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                ) : (
                  <Shield className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                )}
                <span>{risk}</span>
              </li>
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
                onClick={() => window.open(tool.websiteUrl as string, "_blank")}
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
                className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                disabled
              >
                <Check className="mr-1 h-4 w-4" />
                Approved
              </Button>
            ) : tool.status === Status.BLOCKED ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                disabled
              >
                <Ban className="mr-1 h-4 w-4" />
                Blocked
              </Button>
            ) : (
              <>
                <span className="mr-2 text-sm text-slate-500 dark:text-slate-400">Mark as:</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
                  onClick={handleBlock}
                  disabled={updateToolStatus.isPending}
                >
                  <Ban className="mr-1 h-4 w-4" />
                  Block
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
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
