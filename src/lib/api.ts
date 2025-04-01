import { queryClient, apiRequest } from "./queryClient";
import { AITool, Status } from "@/types";

export async function getTools(filters?: {
  riskLevel?: string;
  category?: string;
  source?: string;
  date?: string;
  tab?: string;
}): Promise<AITool[]> {
  const response = await fetch(`/api/tools${filtersToQueryString(filters)}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch tools");
  }
  
  return await response.json();
}

export async function getToolStats(): Promise<{
  newTools: number;
  highRiskTools: number;
  pendingReview: number;
  approvedTools: number;
}> {
  const response = await fetch("/api/tools/stats");
  
  if (!response.ok) {
    throw new Error("Failed to fetch tool stats");
  }
  
  return await response.json();
}

export async function updateToolStatus(id: number, status: "approved" | "blocked"): Promise<void> {
  await apiRequest("PATCH", `/api/tools/${id}/status`, { status });
  
  // Invalidate queries that may be affected by this change
  queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
  queryClient.invalidateQueries({ queryKey: ["/api/tools/stats"] });
}

export async function exportData(options: {
  startDate: string;
  endDate: string;
  options: {
    includeRisks: boolean;
    includeCategories: boolean;
    includeProviders: boolean;
  };
  format: string;
}): Promise<Blob> {
  const response = await apiRequest("POST", "/api/export", options);
  return await response.blob();
}

export async function getRiskAssessment(period: string = "week"): Promise<any> {
  const response = await fetch(`/api/risk-assessment?period=${period}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch risk assessment");
  }
  
  return await response.json();
}

export async function getSettings(): Promise<any> {
  const response = await fetch("/api/settings");
  
  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  
  return await response.json();
}

export async function updateSettings(settings: any): Promise<void> {
  await apiRequest("PATCH", "/api/settings", settings);
  queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
}

// Helper function to convert filters object to query string
function filtersToQueryString(filters?: Record<string, string>): string {
  if (!filters) return "";
  
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value);
    }
  });
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
