import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  MessageCircle,
  ArrowRight
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

// Animation variants für verschiedene Effekte
const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scrollReveal = {
  initial: { 
    opacity: 0,
    y: 50
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function Home() {
  const [newsTab, setNewsTab] = useState<string>("all");
  const [isVisible, setIsVisible] = useState({
    news: false,
    activities: false
  });

  // Intersection Observer Setup
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2
    };

    const newsObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(prev => ({ ...prev, news: entry.isIntersecting })),
      observerOptions
    );

    const activitiesObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(prev => ({ ...prev, activities: entry.isIntersecting })),
      observerOptions
    );

    const newsElement = document.getElementById("news-section");
    const activitiesElement = document.getElementById("activities-section");

    if (newsElement) newsObserver.observe(newsElement);
    if (activitiesElement) activitiesObserver.observe(activitiesElement);

    return () => {
      if (newsElement) newsObserver.unobserve(newsElement);
      if (activitiesElement) activitiesObserver.unobserve(activitiesElement);
    };
  }, []);
  
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 min-h-[500px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        <div className="relative h-full max-w-7xl mx-auto px-6 py-16 flex items-center">
          <div className="max-w-[640px] relative z-10">
            <motion.h1 
              className="text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Sichere KI-Nutzung für Ihr Unternehmen
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI Guard überwacht und bewertet KI-Tools automatisch, damit Ihre Mitarbeiter diese sicher und effizient nutzen können.
            </motion.p>
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Dashboard öffnen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Mehr erfahren
              </Button>
            </motion.div>
          </div>
          <div className="hidden xl:block absolute right-6 top-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-white/20 rounded-lg blur"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8">
                <svg
                  width="96"
                  height="96"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white mb-4"
                >
                  <path
                    d="M16 2L28 8V24L16 30L4 24V8L16 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="16" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                  <circle cx="20" cy="16" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="22" r="1.5" fill="currentColor" />
                  <path
                    d="M16 11.5L12 14.5M12 17.5L16 20.5M16 20.5L20 17.5M20 14.5L16 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="text-5xl font-bold text-white mb-2">100%</div>
                <div className="text-white/80">Sicherheitsabdeckung</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="mt-16 relative z-10">
          <motion.div 
            className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Karte 1: Tool-Erkennung */}
            <motion.div variants={fadeInUp} className="flex">
              <Card className="bg-white dark:bg-slate-900 w-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="p-6">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Radar className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl mb-2">Tool-Erkennung</CardTitle>
                  <CardDescription className="text-base">Automatische Erkennung neuer AI-Tools</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Kontinuierliche Überwachung öffentlicher Quellen wie GitHub, ProductHunt und mehr.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Karte 2: Sicherheitsbewertung */}
            <motion.div variants={fadeInUp} className="flex">
              <Card className="bg-white dark:bg-slate-900 w-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="p-6">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl mb-2">Sicherheitsbewertung</CardTitle>
                  <CardDescription className="text-base">Automatisierte Risikoanalyse</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Bewertung von Datenschutz, Sicherheit und Compliance-Risiken jedes Tools.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Karte 3: Compliance */}
            <motion.div variants={fadeInUp} className="flex">
              <Card className="bg-white dark:bg-slate-900 w-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="p-6">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl mb-2">Compliance</CardTitle>
                  <CardDescription className="text-base">Richtlinien & Kontrolle</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Durchsetzung von Unternehmensrichtlinien für die AI-Tool-Nutzung.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* News Section */}
        <motion.div
          id="news-section"
          initial="initial"
          animate={isVisible.news ? "animate" : "initial"}
          variants={scrollReveal}
          className="mt-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold dark:text-white">Aktuelle AI-News</h2>
            <Button variant="outline" size="sm" className="gap-2">
              Alle anzeigen
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue={newsTab} onValueChange={setNewsTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Alle</TabsTrigger>
              <TabsTrigger value="tools">Neue Tools</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="security">Sicherheit</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="space-y-4">
                {aiNewsData.map((news) => (
                  <div key={news.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="mt-1">{getSourceIcon(news.source)}</div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{news.title}</div>
                      <div className="text-sm text-slate-500">{news.date}</div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Activities Section */}
        <motion.div
          id="activities-section"
          initial="initial"
          animate={isVisible.activities ? "animate" : "initial"}
          variants={scrollReveal}
          className="mt-12 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold dark:text-white">Letzte Aktivitäten</h2>
            <Button variant="outline" size="sm">
              Alle anzeigen
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivitiesData.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{activity.toolName}</div>
                  <div className="text-sm text-slate-500">
                    {activity.user} • {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}