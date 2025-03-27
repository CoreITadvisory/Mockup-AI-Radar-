import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import AITools from "@/pages/AITools";
import RiskAssessment from "@/pages/RiskAssessment";
import Settings from "@/pages/Settings";
import LandingPage from "@/pages/LandingPage";
import { ToolsProvider } from "./contexts/ToolsContext";
import Sidebar from "./components/layout/Sidebar";
import MobileNav from "./components/layout/MobileNav";
import Header from "./components/layout/Header";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

function AppRoutes() {
  const [location] = useLocation();
  const isLandingPage = location === "/";
  
  // Zeige die Landing Page ohne Layout
  if (isLandingPage) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
      </Switch>
    );
  }
  
  // Zeige alle anderen Seiten mit dem App-Layout
  return (
    <Layout>
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/tools" component={AITools} />
        <Route path="/risks" component={RiskAssessment} />
        <Route path="/settings" component={Settings} />
        <Route path="/404" component={NotFound} />
        <Route path="/:rest*">
          {(params) => <Redirect to={params.rest ? "/404" : "/home"} />}
        </Route>
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToolsProvider>
        <AppRoutes />
        <Toaster />
      </ToolsProvider>
    </QueryClientProvider>
  );
}

export default App;
