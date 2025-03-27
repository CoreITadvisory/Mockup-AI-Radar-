import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { AITool, Status } from "@shared/schema";

export function useToolsQuery(filters?: Record<string, string>) {
  return useQuery<AITool[]>({
    queryKey: ["/api/tools", filters],
    // Ensure we're invalidating the query when filters change
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
}

export function useToolStats() {
  return useQuery<{
    newTools: number;
    highRiskTools: number;
    pendingReview: number;
    approvedTools: number;
  }>({
    queryKey: ["/api/tools/stats"],
  });
}

export function useUpdateToolStatus() {
  return useMutation({
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
    },
  });
}

export function useRiskAssessment(period: string = "week") {
  return useQuery({
    queryKey: ["/api/risk-assessment", { period }],
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/export", data);
    },
  });
}
