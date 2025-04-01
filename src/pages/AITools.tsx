import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolCard from "@/components/tools/ToolCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskLevel, Status, Category, Source } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, X, Filter, AlertCircle, AlertTriangle, Shield, Github, Hash, Twitter, MessageCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToolsQuery } from "@/hooks/use-tools";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export default function AITools() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    riskLevel?: string;
    category?: string;
    source?: string;
  }>({});
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  
  // Clean up filters to remove "all" values
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value && value !== "all")
  );
  
  // Use the custom hook with combined filters
  const { data: tools, isLoading, isError, refetch } = useToolsQuery({
    ...(activeTab !== "all" ? { tab: activeTab } : {}),
    ...cleanFilters
  });

  // Filter tools based on search query (client-side filtering)
  const filteredTools = tools?.filter(tool => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      (tool.provider && tool.provider.toLowerCase().includes(query)) ||
      tool.category.toLowerCase().includes(query)
    );
  });

  // Get filter badge icon
  const getFilterIcon = (filterType: string, filterValue: string) => {
    if (filterType === 'riskLevel') {
      switch (filterValue) {
        case RiskLevel.HIGH:
          return <AlertCircle className="h-3 w-3 mr-1 text-red-500" />;
        case RiskLevel.MEDIUM:
          return <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />;
        case RiskLevel.LOW:
          return <Shield className="h-3 w-3 mr-1 text-green-500" />;
        default:
          return null;
      }
    } else if (filterType === 'source') {
      switch (filterValue) {
        case Source.GITHUB:
          return <Github className="h-3 w-3 mr-1" />;
        case Source.PRODUCT_HUNT:
          return <Hash className="h-3 w-3 mr-1" />;
        case Source.TWITTER:
          return <Twitter className="h-3 w-3 mr-1" />;
        case Source.REDDIT:
          return <MessageCircle className="h-3 w-3 mr-1" />;
        default:
          return null;
      }
    }
    return null;
  };

  // Get human-readable filter label
  const getFilterLabel = (filterType: string, filterValue: string) => {
    if (filterType === 'riskLevel') {
      switch (filterValue) {
        case RiskLevel.HIGH:
          return 'High Risk';
        case RiskLevel.MEDIUM:
          return 'Medium Risk';
        case RiskLevel.LOW:
          return 'Low Risk';
        default:
          return filterValue;
      }
    } else if (filterType === 'category') {
      return filterValue.charAt(0).toUpperCase() + filterValue.slice(1);
    } else if (filterType === 'source') {
      switch (filterValue) {
        case Source.PRODUCT_HUNT:
          return 'ProductHunt';
        default:
          return filterValue.charAt(0).toUpperCase() + filterValue.slice(1);
      }
    }
    return filterValue;
  };

  // Remove a single filter
  const removeFilter = (filterType: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterType as keyof typeof filters];
    setFilters(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setFilterSheetOpen(false);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Tools</h1>
          <p className="text-slate-500">Manage and review detected AI tools</p>
        </div>
        
        <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
          <div className="relative w-full md:w-64 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Suche nach Tools..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 hover:text-slate-900"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 md:ml-2">
                <Filter className="h-4 w-4" />
                Filter
                {Object.keys(filters).length > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                    {Object.keys(filters).length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filter Tools</SheetTitle>
                <SheetDescription>
                  Wenden Sie Filter an, um die richtigen Tools zu finden.
                </SheetDescription>
              </SheetHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="risk-level">Risiko-Level</Label>
                  <Select 
                    value={filters.riskLevel || ""}
                    onValueChange={(value) => {
                      if (!value) {
                        // Erstelle eine Kopie und entferne den riskLevel Filter
                        const newFilters = {...filters};
                        delete newFilters.riskLevel;
                        setFilters(newFilters);
                      } else {
                        setFilters({...filters, riskLevel: value});
                      }
                    }}
                  >
                    <SelectTrigger id="risk-level">
                      <SelectValue placeholder="Beliebig" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Beliebig</SelectItem>
                      <SelectItem value={RiskLevel.HIGH}>Hoch</SelectItem>
                      <SelectItem value={RiskLevel.MEDIUM}>Mittel</SelectItem>
                      <SelectItem value={RiskLevel.LOW}>Niedrig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie</Label>
                  <Select 
                    value={filters.category || ""}
                    onValueChange={(value) => {
                      if (!value) {
                        const newFilters = {...filters};
                        delete newFilters.category;
                        setFilters(newFilters);
                      } else {
                        setFilters({...filters, category: value});
                      }
                    }}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Beliebig" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Beliebig</SelectItem>
                      <SelectItem value={Category.TEXT}>Text</SelectItem>
                      <SelectItem value={Category.IMAGE}>Bild</SelectItem>
                      <SelectItem value={Category.VOICE}>Stimme</SelectItem>
                      <SelectItem value={Category.CODING}>Programmieren</SelectItem>
                      <SelectItem value={Category.DATA}>Daten</SelectItem>
                      <SelectItem value={Category.OTHER}>Sonstige</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source">Quelle</Label>
                  <Select 
                    value={filters.source || ""}
                    onValueChange={(value) => {
                      if (!value) {
                        const newFilters = {...filters};
                        delete newFilters.source;
                        setFilters(newFilters);
                      } else {
                        setFilters({...filters, source: value});
                      }
                    }}
                  >
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Beliebig" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Beliebig</SelectItem>
                      <SelectItem value={Source.GITHUB}>GitHub</SelectItem>
                      <SelectItem value={Source.PRODUCT_HUNT}>ProductHunt</SelectItem>
                      <SelectItem value={Source.TWITTER}>Twitter/X</SelectItem>
                      <SelectItem value={Source.REDDIT}>Reddit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <SheetFooter>
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Filter zurücksetzen
                </Button>
                <Button className="w-full" onClick={() => setFilterSheetOpen(false)}>
                  Anwenden
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {Object.keys(cleanFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(cleanFilters).map(([filterType, filterValue]) => (
            <Badge 
              key={filterType} 
              variant="outline"
              className="py-1 px-2 flex items-center gap-1 bg-slate-100 dark:bg-slate-800"
            >
              {getFilterIcon(filterType, filterValue as string)}
              <span>{getFilterLabel(filterType, filterValue as string)}</span>
              <button
                onClick={() => removeFilter(filterType)}
                className="ml-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {Object.keys(cleanFilters).length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs" 
              onClick={resetFilters}
            >
              Reset All
            </Button>
          )}
        </div>
      )}

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
          ) : filteredTools && filteredTools.length > 0 ? (
            filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">Keine passenden Tools gefunden.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="high-risk" className="space-y-4">
          {isLoading ? (
            <ToolsSkeletons />
          ) : filteredTools && filteredTools.length > 0 ? (
            filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">Keine passenden Tools gefunden.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <ToolsSkeletons />
          ) : filteredTools && filteredTools.length > 0 ? (
            filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">Keine passenden Tools gefunden.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {isLoading ? (
            <ToolsSkeletons />
          ) : filteredTools && filteredTools.length > 0 ? (
            filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">Keine passenden Tools gefunden.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          {isLoading ? (
            <ToolsSkeletons />
          ) : filteredTools && filteredTools.length > 0 ? (
            filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">Keine passenden Tools gefunden.</p>
            </div>
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
