import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { PredictionModule } from "@/components/site/PredictionModule";
import { RankingsSection } from "@/components/site/RankingsSection";
import heroBall from "@/assets/hero-ball.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <header className="relative overflow-hidden pt-20 pb-12 border-b border-border">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,var(--primary)_0%,transparent_70%)]" />
        </div>
        <img
          src={heroBall}
          alt=""
          aria-hidden
          width={1024}
          height={1024}
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,780px)] max-w-none opacity-40 mix-blend-screen [mask-image:radial-gradient(circle_at_center,black_45%,transparent_75%)]"
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="relative font-display text-6xl md:text-8xl font-extrabold tracking-tighter uppercase italic text-balance mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            Anticipez le <span className="text-primary">Jeu.</span>
          </h1>
          <p className="relative max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed mb-12 text-pretty">
            Fusion de l'historique FIFA et du Machine Learning pour des probabilités de match
            précises. L'intelligence du terrain, codée.
          </p>
        </div>
      </header>

      <PredictionModule />
      <RankingsSection />

      <footer className="py-12 border-t border-border text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
            Field.AI / Projet Académique Data Science 2026 / © Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}
