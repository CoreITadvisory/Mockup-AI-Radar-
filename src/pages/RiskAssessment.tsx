import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RiskLevel } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function RiskAssessment() {
  const [period, setPeriod] = useState("week");

  const { data: riskStats, isLoading } = useQuery({
    queryKey: ["/api/risk-assessment", { period }],
  });

  const riskDistributionData = [
    { name: "High Risk", value: riskStats?.highRisk || 0, color: "#ef4444" },
    { name: "Medium Risk", value: riskStats?.mediumRisk || 0, color: "#f97316" },
    { name: "Low Risk", value: riskStats?.lowRisk || 0, color: "#22c55e" },
  ];

  const riskCategoryData = riskStats?.categories || [
    { name: "Text Generation", high: 0, medium: 0, low: 0 },
    { name: "Image Generation", high: 0, medium: 0, low: 0 },
    { name: "Voice Synthesis", high: 0, medium: 0, low: 0 },
    { name: "Coding Assistant", high: 0, medium: 0, low: 0 },
    { name: "Data Processing", high: 0, medium: 0, low: 0 },
  ];

  const RISK_COLORS = {
    high: "#ef4444",
    medium: "#f97316",
    low: "#22c55e",
  };

  const commonRisks = riskStats?.commonRisks || [];

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Risk Assessment</h1>
          <p className="text-slate-500">Analyze security risks across detected AI tools</p>
        </div>
        <Tabs value={period} onValueChange={setPeriod} className="mt-4 md:mt-0">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Breakdown of tools by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk by Category</CardTitle>
            <CardDescription>Distribution of risks across tool categories</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={riskCategoryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="high" stackId="a" name="High Risk" fill={RISK_COLORS.high} />
                  <Bar dataKey="medium" stackId="a" name="Medium Risk" fill={RISK_COLORS.medium} />
                  <Bar dataKey="low" stackId="a" name="Low Risk" fill={RISK_COLORS.low} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Common Security Risks</CardTitle>
          <CardDescription>Most frequently detected security vulnerabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </>
            ) : (
              commonRisks.map((risk, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{risk.name}</span>
                      <Badge
                        className={`
                          ${risk.severity === "high" && "bg-red-100 text-red-800 hover:bg-red-200"}
                          ${risk.severity === "medium" && "bg-orange-100 text-orange-800 hover:bg-orange-200"}
                          ${risk.severity === "low" && "bg-green-100 text-green-800 hover:bg-green-200"}
                        `}
                      >
                        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                      </Badge>
                    </div>
                    <span className="text-sm text-slate-500">{risk.frequency} tools</span>
                  </div>
                  <Progress value={risk.percentage} className={`h-2 ${
                    risk.severity === "high" ? "bg-red-100" : 
                    risk.severity === "medium" ? "bg-orange-100" : "bg-green-100"
                  }`} />
                  <p className="text-sm text-slate-600">{risk.description}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
