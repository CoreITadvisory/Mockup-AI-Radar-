# AI Guard

Eine moderne Webanwendung zur Überwachung und Bewertung von KI-Tools für Unternehmenssicherheit.

## Projektbeschreibung

AI Guard ist eine fortschrittliche Webapplikation, die automatisch neue KI-Tools aus öffentlichen Quellen (GitHub, ProductHunt, Twitter/X, Reddit, KI-News-APIs) sammelt und analysiert. Das System hilft Sicherheitsteams in großen Unternehmen, potenzielle Risiken neuer KI-Tools zu überwachen, bevor Mitarbeiter sie mit sensiblen Daten verwenden.

## Hauptfunktionen

- **Automatische Erkennung**: Überwachung neuer KI-Tools aus mehreren Quellen
- **Sicherheitsbewertung**: KI-gestützte Analyse von Sicherheitsrisiken
- **Filteroptionen**: Einfache Sortierung nach Risikolevel, Kategorie und Quelle
- **Exportfunktion**: PDF- und CSV-Export für Berichte und Analysen
- **Status-Management**: Tools als "blockiert" oder "zugelassen" im Unternehmen markieren

## Technologie-Stack

- Frontend: React mit TypeScript
- UI-Framework: Tailwind CSS mit shadcn/ui-Komponenten
- Backend: Express.js
- Datenbank: In-Memory Storage (für Prototyping und Entwicklung)
- APIs: OpenAI für Sicherheitsbewertungen

## Integration mit GitHub

Dieses Projekt ist mit folgendem GitHub-Repository verbunden:
https://github.com/CoreITadvisory/replit-ai-radar-.git

### Um Änderungen von Replit zu GitHub zu pushen:

1. Stelle sicher, dass du in deinem Replit-Projekt angemeldet bist
2. Öffne das Shell-Terminal in Replit
3. Konfiguriere deine Git-Anmeldeinformationen:
   ```
   git config --global user.email "deine-email@beispiel.de"
   git config --global user.name "Dein Name"
   ```
4. Erstelle einen Personal Access Token (PAT) in GitHub:
   - Gehe zu GitHub → Settings → Developer settings → Personal access tokens
   - Erstelle einen Token mit "repo" Berechtigungen
5. Push zu GitHub mit deinem Token:
   ```
   git push https://DEIN_GITHUB_USERNAME:DEIN_PERSONAL_ACCESS_TOKEN@github.com/CoreITadvisory/replit-ai-radar-.git main
   ```

Alternativ kannst du auch GitHub CLI oder die GitHub Desktop-App verwenden, um das Repository zu klonen und Änderungen zu synchronisieren.

## Entwicklungsumgebung

Das Projekt läuft in einer Replit-Umgebung und kann mit dem "Start application" Workflow gestartet werden.