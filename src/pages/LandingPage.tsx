import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Search, LineChart, CheckCircle } from "lucide-react";
import { useTheme } from "@/contexts/ToolsContext";
import { useRef } from "react";

export default function LandingPage() {
  const { isDarkMode } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Video Hintergrund */}
        <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
            src="/ai-background.mp4"
          />
        </div>
        {/* Fallback falls das Video nicht lädt */}
        {false && (
          <>
            {/* Fallback Gradient Hintergrund */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/40 dark:to-purple-950/40 -z-10"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 blur-3xl -z-10"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-900/30 dark:to-blue-900/30 blur-3xl -z-10"></div>
          </>
        )}

        <div className="container mx-auto px-6 py-16 md:py-32">
          <nav className="flex justify-between items-center mb-12 md:mb-16 relative z-10">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 shadow-lg">
                <Shield className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white drop-shadow-sm">AI Guard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="secondary" className="shadow-md bg-white/90 hover:bg-white border-0 text-slate-900 font-medium">
                  Login
                </Button>
              </Link>
            </div>
          </nav>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 inline-block text-transparent bg-clip-text drop-shadow-sm">
                Sichern Sie Ihr Unternehmen vor AI-Risiken
              </h1>
              <p className="text-lg md:text-xl mb-8 text-slate-900 dark:text-white drop-shadow-md rounded-lg p-3 bg-white/80 dark:bg-black/40 backdrop-blur-sm inline-block">
                Automatische Erkennung und Bewertung neuer KI-Tools, bevor Ihre Mitarbeiter sie mit sensiblen Daten verwenden.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg border-0">
                    Jetzt starten
                  </Button>
                </Link>
                <Button variant="secondary" className="px-8 py-6 text-lg font-medium rounded-lg shadow-lg bg-white/90 hover:bg-white text-slate-900 border-0">
                  Demo ansehen
                </Button>
              </div>
            </div>

            <div className="md:w-1/2 relative hidden md:block">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                {/* Browser chrome */}
                <div className="bg-slate-50 dark:bg-slate-800 p-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                {/* Dashboard preview */}
                <div className="p-4">
                  <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow">
                    <img 
                      src="/images/dashboard-preview.png" 
                      alt="AI Guard Dashboard" 
                      className="w-full object-cover rounded-lg shadow-inner"
                    />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg -z-10 blur-xl opacity-50"></div>
              <div className="absolute -left-5 -top-5 w-16 h-16 bg-blue-500 rounded-full -z-10 blur-xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Wie AI Guard Ihr Unternehmen schützt
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Automatische Erkennung</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Tägliches Monitoring von öffentlichen Quellen wie GitHub, ProductHunt, Twitter/X und Reddit nach neuen AI-Tools.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Sicherheitsbewertung</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Umfassende Analyse der Sicherheitsrisiken und Datenschutzrichtlinien jedes neuen AI-Tools.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Entscheidungshilfe</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Einrichtung unternehmensweiter Richtlinien für die Nutzung von AI-Tools durch Markieren als "zugelassen" oder "blockiert".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-8 py-12 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Starten Sie heute mit dem Schutz Ihrer Unternehmensdata
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                AI Guard hilft Ihnen, Risiken zu erkennen, bevor Ihre Mitarbeiter sensible Daten gefährden. Beginnen Sie noch heute mit dem Monitoring.
              </p>
              <Link href="/dashboard">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-medium rounded-lg">
                  Jetzt kostenlos starten
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 border-t ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-1.5">
                <Shield className="text-white h-4 w-4" />
              </div>
              <span className="text-sm font-semibold dark:text-white">AI Guard</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} AI Guard. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}