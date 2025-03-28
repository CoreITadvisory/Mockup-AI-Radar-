import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  LineChart, 
  Radar, 
  Zap, 
  ExternalLink,
  Clock, 
  Database, 
  CheckCircle,
  BanIcon,
  Github,
  Twitter,
  MessageCircle
} from "lucide-react";

// Dummy data für aktuelle AI-News
const aiNewsData = [
  {
    id: 1,
    title: "GPT-5 with enhanced reasoning capabilities released",
    source: "twitter",
    date: "1 hour ago",
    url: "#"
  },
  {
    id: 2,
    title: "New image generation model released on GitHub",
    source: "github",
    date: "3 hours ago",
    url: "#"
  },
  {
    id: 3,
    title: "Open-source voice cloning tool raises security concerns",
    source: "producthunt",
    date: "5 hours ago",
    url: "#"
  },
  {
    id: 4,
    title: "Security researchers discover vulnerability in popular AI model",
    source: "reddit",
    date: "Yesterday",
    url: "#"
  }
];

// Dummy data für letzte Aktivitäten
const recentActivitiesData = [
  {
    id: 1,
    type: "approved",
    toolName: "TextWizard",
    time: "10 minutes ago",
    user: "Admin User"
  },
  {
    id: 2,
    type: "blocked",
    toolName: "ImageGenius",
    time: "1 hour ago",
    user: "Security Team"
  },
  {
    id: 3,
    type: "detected",
    toolName: "VoiceClone",
    time: "3 hours ago",
    user: "System"
  },
  {
    id: 4,
    type: "risk_assessment",
    toolName: "CodeReviewer",
    time: "Yesterday",
    user: "System"
  }
];

// Source Icon Helper
const getSourceIcon = (source: string) => {
  switch (source) {
    case "github":
      return <Github className="h-4 w-4" />;
    case "producthunt":
      return <Zap className="h-4 w-4" />;
    case "twitter":
      return <Twitter className="h-4 w-4" />;
    case "reddit":
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
};

// Activity Icon Helper
const getActivityIcon = (type: string) => {
  switch (type) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "blocked":
      return <BanIcon className="h-4 w-4 text-red-500" />;
    case "detected":
      return <Radar className="h-4 w-4 text-blue-500" />;
    case "risk_assessment":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Clock className="h-4 w-4 text-slate-500" />;
  }
};

export default function Home() {
  const [newsTab, setNewsTab] = useState<string>("all");
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Video Banner Section */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <video 
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/ai-loop.mp4" type="video/mp4" />
          Ihr Browser unterstützt keine Videos.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Guard</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Die intelligente Sicherheitslösung für Unternehmen, die KI-Tools sicher nutzen wollen
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="p-8 md:p-12 md:w-3/5">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                AI Guard Dashboard
              </h1>
              <p className="text-blue-100 mb-6 text-lg">
                AI Guard hilft Unternehmen, neue KI-Tools zu erkennen, zu bewerten und sicher zu managen.
                Identifiziere potenzielle Risiken, bevor sie zu Sicherheitsproblemen werden.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button className="bg-white text-blue-600 hover:bg-blue-50" size="lg">
                  <Radar className="mr-2 h-4 w-4" />
                  Dashboard öffnen
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-blue-700" size="lg">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Risikoanalyse
                </Button>
              </div>
            </div>
            <div className="p-8 md:w-2/5 hidden md:flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-white text-center">
                  <Shield className="h-20 w-20 mx-auto mb-4" />
                  <div className="text-4xl font-bold">100%</div>
                  <div className="text-sm">Sicherheitsabdeckung</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                <Radar className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Tool-Erkennung</CardTitle>
              <CardDescription>
                Automatische Erkennung neuer KI-Tools aus mehreren Quellen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm">
                AI Guard überwacht kontinuierlich GitHub, Product Hunt, Twitter/X und andere Plattformen, 
                um neue KI-Tools zu identifizieren, die Mitarbeiter nutzen könnten.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2">
                Mehr erfahren <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Risikobewertung</CardTitle>
              <CardDescription>
                Identifiziere Sicherheitsrisiken bevor sie zu Problemen werden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm">
                Jedes Tool wird automatisch analysiert, um mögliche Sicherheitsbedenken zu identifizieren,
                von Datenschutz bis zu potenziellen Angriffsvektoren.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2">
                Mehr erfahren <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                <LineChart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Security-Dashboard</CardTitle>
              <CardDescription>
                Übersicht und Entscheidungshilfe für das Security-Team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm">
                Umfassendes Dashboard zur Überwachung erkannter Tools, Risikobewertungen und
                Genehmigungsstatus. Erstelle exportierbare Berichte.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2">
                Mehr erfahren <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* News and Activity Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* AI News Section */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-500" />
                AI News
              </CardTitle>
              <div className="mt-2">
                <Tabs value={newsTab} onValueChange={setNewsTab}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="github">GitHub</TabsTrigger>
                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {aiNewsData
                  .filter(item => newsTab === "all" || item.source === newsTab || (newsTab === "other" && !["github", "twitter"].includes(item.source)))
                  .map((news) => (
                    <div key={news.id} className="flex space-x-3 border-b border-slate-100 pb-3 last:border-0">
                      <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        {getSourceIcon(news.source)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          <a href={news.url} className="hover:text-blue-600 transition-colors">
                            {news.title}
                          </a>
                        </h4>
                        <div className="text-xs text-slate-400 mt-1 flex items-center">
                          <span>{news.source.charAt(0).toUpperCase() + news.source.slice(1)}</span>
                          <span className="mx-1">•</span>
                          <span>{news.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-purple-500" />
                Letzte Aktivitäten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivitiesData.map((activity) => (
                  <div key={activity.id} className="flex space-x-3 border-b border-slate-100 pb-3 last:border-0">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium flex items-center">
                        <span>{activity.toolName}</span>
                        {activity.type === "approved" && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                            Approved
                          </span>
                        )}
                        {activity.type === "blocked" && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                            Blocked
                          </span>
                        )}
                      </h4>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <span>{activity.user}</span>
                        <span className="mx-1">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        

      </div>
    </div>
  );
}