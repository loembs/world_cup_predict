import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { TEAMS } from "@/lib/teams";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Field.AI" },
      {
        name: "description",
        content:
          "Tableau de bord Field.AI : KPI du modèle de prédiction FIFA, précision, matchs analysés et tendances des équipes.",
      },
      { property: "og:title", content: "Dashboard — Field.AI" },
      {
        property: "og:description",
        content: "KPI et performances du modèle de prédiction FIFA.",
      },
    ],
  }),
  component: DashboardPage,
});

const KPIS = [
  { label: "Précision Modèle", value: "78.4%", trend: "+2.1", hint: "Test set (2018-2025)" },
  { label: "Log Loss", value: "0.912", trend: "-0.04", hint: "Cross-entropie moyenne" },
  { label: "Matchs Analysés", value: "47 812", trend: "+1 204", hint: "Base d'entraînement" },
  { label: "Équipes Couvertes", value: "211", trend: "+0", hint: "Fédérations FIFA" },
  { label: "Indice Brier", value: "0.187", trend: "-0.006", hint: "Plus bas = meilleur" },
  { label: "ROC-AUC", value: "0.842", trend: "+0.011", hint: "Multiclasse pondéré" },
];

const FORM_HISTORY = [42, 55, 48, 61, 58, 66, 70, 68, 74, 72, 78, 76, 79, 78, 82, 80, 78, 84];

const RECENT = [
  { home: "FRA", away: "ARG", pred: "N", real: "N", ok: true, conf: 62 },
  { home: "ESP", away: "GER", pred: "1", real: "1", ok: true, conf: 71 },
  { home: "BRA", away: "ITA", pred: "1", real: "N", ok: false, conf: 58 },
  { home: "ENG", away: "POR", pred: "1", real: "1", ok: true, conf: 66 },
  { home: "NED", away: "BEL", pred: "2", real: "2", ok: true, conf: 69 },
  { home: "CRO", away: "MAR", pred: "1", real: "2", ok: false, conf: 54 },
  { home: "JPN", away: "USA", pred: "N", real: "N", ok: true, conf: 61 },
];

function DashboardPage() {
  const teamsByCode = Object.fromEntries(TEAMS.map((t) => [t.code, t]));
  const risers = [...TEAMS].sort((a, b) => b.evolution - a.evolution).slice(0, 4);
  const fallers = [...TEAMS].sort((a, b) => a.evolution - b.evolution).slice(0, 4);

  const max = Math.max(...FORM_HISTORY);
  const min = Math.min(...FORM_HISTORY);
  const points = FORM_HISTORY.map((v, i) => {
    const x = (i / (FORM_HISTORY.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">
              Field.AI / Dashboard
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold uppercase italic tracking-tighter">
              Contrôle <span className="text-primary">Analytique</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Suivi en temps réel des performances du modèle, des tendances FIFA et des dernières
              prédictions produites.
            </p>
          </div>
          <div className="flex gap-3 text-[10px] font-mono uppercase tracking-widest">
            <span className="px-3 py-2 border border-border bg-surface">Saison 2026</span>
            <span className="px-3 py-2 border border-primary/40 bg-primary/10 text-primary flex items-center gap-2">
              <span className="size-1.5 bg-primary rounded-full animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </header>

      {/* KPI grid */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border">
        {KPIS.map((k) => {
          const positive = k.trend.trim().startsWith("+");
          const negative = k.trend.trim().startsWith("-");
          return (
            <div key={k.label} className="bg-background p-5 flex flex-col gap-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {k.label}
              </div>
              <div className="font-display text-3xl font-extrabold tabular-nums">{k.value}</div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted-foreground">{k.hint}</span>
                <span
                  className={
                    positive
                      ? "text-primary"
                      : negative
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  {k.trend}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Accuracy chart */}
        <div className="lg:col-span-2 bg-card border border-border p-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-extrabold uppercase italic">
                Précision · 18 dernières semaines
              </h2>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Rolling window · fenêtre 30 matchs
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl font-black tabular-nums text-primary">
                {FORM_HISTORY[FORM_HISTORY.length - 1]}%
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                actuelle
              </div>
            </div>
          </div>
          <div className="relative w-full aspect-[16/6]">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              <defs>
                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="100"
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="0.2"
                />
              ))}
              <polygon points={`0,100 ${points} 100,100`} fill="url(#area)" />
              <polyline
                points={points}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="0.8"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-card border border-border p-8">
          <h2 className="font-display text-xl font-extrabold uppercase italic mb-6">
            Distribution des Résultats
          </h2>
          <div className="space-y-5">
            {[
              { label: "Victoire domicile", value: 46, key: "1" },
              { label: "Match nul", value: 24, key: "N" },
              { label: "Victoire extérieur", value: 30, key: "2" },
            ].map((r) => (
              <div key={r.key}>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span>{r.label}</span>
                  <span className="text-primary font-mono">{r.value}%</span>
                </div>
                <div className="h-2 bg-secondary">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${r.value}%` }}
                    aria-hidden
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Buts moyens
              </div>
              <div className="font-display text-2xl font-extrabold tabular-nums">2.63</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Écart moyen
              </div>
              <div className="font-display text-2xl font-extrabold tabular-nums">1.14</div>
            </div>
          </div>
        </div>
      </section>

      {/* Movers + Recent predictions */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border p-8">
          <h2 className="font-display text-xl font-extrabold uppercase italic mb-6">
            Mouvements FIFA
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
                En hausse
              </div>
              <ul className="space-y-3">
                {risers.map((t) => (
                  <li key={t.code} className="flex items-center gap-3 text-sm">
                    <img
                      src={t.flag}
                      alt=""
                      width={24}
                      height={18}
                      loading="lazy"
                      className="w-6 h-auto ring-1 ring-border"
                    />
                    <span className="font-bold italic uppercase text-xs truncate flex-1">
                      {t.name}
                    </span>
                    <span className="text-primary font-mono text-xs">+{t.evolution}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-destructive mb-4">
                En baisse
              </div>
              <ul className="space-y-3">
                {fallers.map((t) => (
                  <li key={t.code} className="flex items-center gap-3 text-sm">
                    <img
                      src={t.flag}
                      alt=""
                      width={24}
                      height={18}
                      loading="lazy"
                      className="w-6 h-auto ring-1 ring-border"
                    />
                    <span className="font-bold italic uppercase text-xs truncate flex-1">
                      {t.name}
                    </span>
                    <span className="text-destructive font-mono text-xs">{t.evolution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-extrabold uppercase italic">
              Dernières Prédictions
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {RECENT.filter((r) => r.ok).length}/{RECENT.length} correctes
            </span>
          </div>
          <div className="divide-y divide-border">
            {RECENT.map((r, i) => {
              const h = teamsByCode[r.home];
              const a = teamsByCode[r.away];
              return (
                <div key={i} className="py-3 flex items-center gap-3 text-sm">
                  <span className="font-mono text-[10px] text-muted-foreground w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <img src={h.flag} alt="" width={20} height={15} className="ring-1 ring-border" />
                  <span className="font-bold italic uppercase text-xs w-16 truncate">
                    {h.name}
                  </span>
                  <span className="text-muted-foreground text-[10px] font-mono">vs</span>
                  <img src={a.flag} alt="" width={20} height={15} className="ring-1 ring-border" />
                  <span className="font-bold italic uppercase text-xs w-16 truncate">
                    {a.name}
                  </span>
                  <span className="flex-1" />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    conf. {r.conf}%
                  </span>
                  <span
                    className={`font-mono text-xs px-2 py-1 border ${
                      r.ok
                        ? "text-primary border-primary/40 bg-primary/10"
                        : "text-destructive border-destructive/40 bg-destructive/10"
                    }`}
                  >
                    {r.pred} / {r.real}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
            Field.AI / Dashboard Analytique / MAJ temps réel
          </p>
        </div>
      </footer>
    </div>
  );
}