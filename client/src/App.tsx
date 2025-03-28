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
  const [location] = useLocation();
  const currentPage = location.substring(1); // Entfernt den führenden Slash
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage={currentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} pageTitle={
          currentPage === "home" ? "Home" : 
          currentPage === "dashboard" ? "Dashboard" : 
          currentPage === "tools" ? "AI Tools" : 
          currentPage === "risks" ? "Risk Assessment" : 
          currentPage === "settings" ? "Settings" : "Dashboard"
        } />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          {children}
        </main>
      </div>
      <MobileNav activePage={currentPage} />
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
        <Route path="/:404*">
          <Redirect to="/404" />
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
