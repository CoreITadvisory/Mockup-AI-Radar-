import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolCard from "@/components/tools/ToolCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RiskLevel, Status, Category, Source } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, X, Filter } from "lucide-react";
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
  
  // Use the custom hook with combined filters
  const { data: tools, isLoading } = useToolsQuery({
    tab: activeTab,
    ...filters
  });

  // Filter tools based on search query
  const filteredTools = tools?.filter(tool => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.provider.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  });

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
                    onValueChange={(value) => setFilters({...filters, riskLevel: value || undefined})}
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
                    onValueChange={(value) => setFilters({...filters, category: value || undefined})}
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
                    onValueChange={(value) => setFilters({...filters, source: value || undefined})}
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
            filteredTools
              .filter((tool) => tool.riskLevel === RiskLevel.HIGH)
              .map((tool) => <ToolCard key={tool.id} tool={tool} />)
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
            filteredTools
              .filter((tool) => tool.status === Status.PENDING)
              .map((tool) => <ToolCard key={tool.id} tool={tool} />)
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
            filteredTools
              .filter((tool) => tool.status === Status.APPROVED)
              .map((tool) => <ToolCard key={tool.id} tool={tool} />)
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
            filteredTools
              .filter((tool) => tool.status === Status.BLOCKED)
              .map((tool) => <ToolCard key={tool.id} tool={tool} />)
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
