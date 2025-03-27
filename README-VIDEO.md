# Video-Hintergrund für AI Guard Landing Page

## Video-Implementierung

Die Landing Page ist bereits vorbereitet, um ein Fullscreen-Video als Hintergrund zu nutzen:

1. Das Video wird über die React `useEffect` Logik in `client/src/pages/LandingPage.tsx` automatisch erkannt und geladen, sobald es verfügbar ist.
2. Wird kein Video gefunden, wird auf den normalen Gradienten-Hintergrund zurückgegriffen.

## Video hinzufügen

Um das Sora-Video einzubinden:

1. Laden Sie das Video von Sora herunter: https://sora.com/g/gen_01jqc36cg2enea0s3b040t6p1h
2. Benennen Sie es in `ai-background.mp4` um
3. Platzieren Sie das Video im Verzeichnis `public/videos/`
4. Voller Pfad sollte sein: `public/videos/ai-background.mp4`
5. Starten Sie die Anwendung neu

## Video-Formatierung

Das Video wird mit folgenden Eigenschaften angezeigt:
- `autoPlay`: Video startet automatisch
- `loop`: Video wiederholt sich endlos
- `muted`: Video wird ohne Ton abgespielt
- `playsInline`: Wichtig für mobile Geräte
- `className="absolute inset-0 w-full h-full object-cover"`: Video wird passend skaliert und füllt den gesamten Bildschirm aus

## Overlay für bessere Lesbarkeit

Über dem Video liegt eine halbtransparente schwarze Schicht (`bg-black/30`), die den Text besser lesbar macht. Die Textbereiche haben zusätzlich leichte Schatten und teilweise halbtransparente Hintergründe für optimale Lesbarkeit.
