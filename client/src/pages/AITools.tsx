import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolCard from "@/components/tools/ToolCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RiskLevel, Status } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function AITools() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: tools, isLoading } = useQuery({
    queryKey: ["/api/tools", { tab: activeTab }],
  });

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Tools</h1>
          <p className="text-slate-500">Manage and review detected AI tools</p>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="high-risk">High Risk</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <ToolsSkeletons />
          ) : (
            tools?.map((tool) => <ToolCard key={tool.id} tool={tool} />)
          )}
        </TabsContent>

        <TabsContent value="high-risk" className="space-y-4">
          {isLoading ? (
            <ToolsSkeletons />
          ) : (
            tools
              ?.filter((tool) => tool.riskLevel === RiskLevel.HIGH)
              .map((tool) => <ToolCard key={tool.id} tool={tool} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <ToolsSkeletons />
          ) : (
            tools
              ?.filter((tool) => tool.status === Status.PENDING)
              .map((tool) => <ToolCard key={tool.id} tool={tool} />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {isLoading ? (
            <ToolsSkeletons />
          ) : (
            tools
              ?.filter((tool) => tool.status === Status.APPROVED)
              .map((tool) => <ToolCard key={tool.id} tool={tool} />)
          )}
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          {isLoading ? (
            <ToolsSkeletons />
          ) : (
            tools
              ?.filter((tool) => tool.status === Status.BLOCKED)
              .map((tool) => <ToolCard key={tool.id} tool={tool} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ToolsSkeletons() {
  return (
    <>
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
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
            </CardContent>
          </Card>
        ))}
    </>
  );
}
