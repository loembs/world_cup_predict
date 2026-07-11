import { useMemo, useState, useEffect } from "react";
import { TEAMS, predictMatch, type Prediction, type Team } from "@/lib/teams";
import confetti from "canvas-confetti";

function TeamSelect({
  label,
  team,
  onChange,
  exclude,
  align = "left",
  isWinner = false,
}: {
  label: string;
  team: Team;
  onChange: (code: string) => void;
  exclude: string;
  align?: "left" | "right";
  isWinner?: boolean;
}) {
  return (
    <div className={`space-y-4 ${align === "right" ? "text-right md:text-left" : ""}`}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="relative flex items-center gap-4 bg-surface p-4 border border-border group hover:border-primary transition-colors">
        <div className={`size-12 shrink-0 grid place-items-center bg-secondary ring-1 ring-input group-hover:ring-primary/50 overflow-hidden ${isWinner ? "winner-flag" : ""}`}>
          <img src={team.flag} alt={`Drapeau ${team.name}`} width={48} height={36} className="w-full h-auto object-cover" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <select
            aria-label={label}
            value={team.code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-transparent text-xl md:text-2xl font-display font-extrabold italic tracking-tight uppercase text-foreground focus:outline-none cursor-pointer"
          >
            {TEAMS.filter((t) => t.code !== exclude).map((t) => (
              <option key={t.code} value={t.code} className="bg-popover text-foreground not-italic font-sans text-base">
                {t.name}
              </option>
            ))}
          </select>
          <div className="text-[10px] font-mono text-muted-foreground mt-1">
            RANG FIFA #{team.rank} · {team.points.toFixed(2)} PTS
          </div>
        </div>
        <svg className="size-4 text-muted-foreground shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

export function PredictionModule() {
  const [homeCode, setHomeCode] = useState("FRA");
  const [awayCode, setAwayCode] = useState("ARG");
  const [result, setResult] = useState<Prediction | null>(null);
  const [computing, setComputing] = useState(false);

  const home = useMemo(() => TEAMS.find((t) => t.code === homeCode)!, [homeCode]);
  const away = useMemo(() => TEAMS.find((t) => t.code === awayCode)!, [awayCode]);

  // Déterminer l'équipe gagnante
  const winner = useMemo(() => {
    if (!result) return null;
    if (result.homeWin > result.draw && result.homeWin > result.awayWin) return 'home';
    if (result.awayWin > result.draw && result.awayWin > result.homeWin) return 'away';
    return null; // Match nul
  }, [result]);

  // Effet de confettis quand un résultat arrive avec un gagnant clair
  useEffect(() => {
    if (result && winner) {
      // Déclencher les confettis depuis les deux côtés
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [result, winner]);

  const runPrediction = () => {
    setComputing(true);
    setResult(null);
    setTimeout(() => {
      setResult(predictMatch(home, away));
      setComputing(false);
    }, 900);
  };

  return (
    <section id="prediction" className="py-20 bg-surface/60 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative bg-card border border-border p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-scan pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center mb-12">
            <TeamSelect
              label="Équipe Domicile"
              team={home}
              exclude={awayCode}
              onChange={(c) => {
                setHomeCode(c);
                setResult(null);
              }}
              isWinner={winner === 'home'}
            />
            <div className="text-4xl font-display font-black italic text-muted-foreground/30 select-none text-center">
              VS
            </div>
            <TeamSelect
              label="Équipe Extérieur"
              team={away}
              exclude={homeCode}
              align="right"
              onChange={(c) => {
                setAwayCode(c);
                setResult(null);
              }}
              isWinner={winner === 'away'}
            />
          </div>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={runPrediction}
              disabled={computing}
              className="w-full max-w-sm py-5 bg-primary text-primary-foreground font-display font-black uppercase italic tracking-widest text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-glow disabled:opacity-60 disabled:cursor-wait"
            >
              {computing ? "Analyse en cours…" : "Calculer la Prédiction"}
            </button>

            {result && (
              <div className="w-full mt-10 space-y-6 animate-fade-up">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    Probabilités de Résultat
                  </h3>
                  <div className="flex gap-3 text-xs font-mono">
                    <span className="text-muted-foreground">Confiance:</span>
                    <span className="text-primary tabular-nums">{result.confidence.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="h-12 w-full flex border border-border overflow-hidden">
                  <div
                    className="h-full bg-primary/90 flex items-center px-3 font-mono font-bold text-primary-foreground text-sm animate-bar overflow-hidden whitespace-nowrap"
                    style={{ "--final-width": `${result.homeWin}%` } as React.CSSProperties}
                  >
                    {result.homeWin}%
                  </div>
                  <div
                    className="h-full bg-secondary flex items-center px-3 font-mono font-bold text-foreground text-sm animate-bar border-x border-background overflow-hidden whitespace-nowrap"
                    style={{ "--final-width": `${result.draw}%` } as React.CSSProperties}
                  >
                    {result.draw}%
                  </div>
                  <div
                    className="h-full bg-muted flex items-center px-3 font-mono font-bold text-foreground/60 text-sm animate-bar overflow-hidden whitespace-nowrap"
                    style={{ "--final-width": `${result.awayWin}%` } as React.CSSProperties}
                  >
                    {result.awayWin}%
                  </div>
                </div>

                <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-widest">
                  <div>{home.name}</div>
                  <div className="text-center text-muted-foreground">Match Nul</div>
                  <div className="text-right">{away.name}</div>
                </div>

                <p className="text-[10px] font-mono text-muted-foreground text-center pt-2">
                  Modèle basé sur la fusion de l'historique des confrontations et du classement FIFA.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}