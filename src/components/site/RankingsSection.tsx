import { TEAMS } from "@/lib/teams";
import modelViz from "@/assets/model-visualization.jpg";

export function RankingsSection() {
  const top = [...TEAMS].sort((a, b) => a.rank - b.rank).slice(0, 10);

  return (
    <section id="classement" className="py-24 border-t border-border scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-display text-3xl font-extrabold uppercase italic tracking-tighter mb-8 flex items-center gap-4">
            Classement FIFA{" "}
            <span className="text-xs font-mono font-normal tracking-normal not-italic text-muted-foreground bg-secondary px-2 py-0.5 border border-border">
              MAJ 11.07.26
            </span>
          </h2>
          <div className="w-full border-t border-border">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="py-4 font-medium">Rang</th>
                  <th className="py-4 font-medium">Équipe</th>
                  <th className="py-4 font-medium text-right">Points</th>
                  <th className="py-4 font-medium text-right">Évol.</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {top.map((t) => (
                  <tr key={t.code} className="border-t border-border hover:bg-foreground/5 transition-colors">
                    <td className={`py-4 tabular-nums ${t.rank === 1 ? "text-primary" : ""}`}>
                      {String(t.rank).padStart(2, "0")}
                    </td>
                    <td className="py-4 font-sans font-bold uppercase italic">
                      <span className="inline-flex items-center gap-3">
                        <img
                          src={t.flag}
                          alt={`Drapeau ${t.name}`}
                          width={24}
                          height={18}
                          loading="lazy"
                          className="w-6 h-auto ring-1 ring-border"
                        />
                        {t.name}
                      </span>
                    </td>
                    <td className="py-4 text-right tabular-nums">{t.points.toFixed(2)}</td>
                    <td
                      className={`py-4 text-right tabular-nums ${
                        t.evolution > 0
                          ? "text-primary"
                          : t.evolution < 0
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {t.evolution > 0 ? `+${t.evolution}` : t.evolution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="methodologie" className="lg:col-span-5 space-y-8 scroll-mt-16">
          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-xl font-extrabold uppercase italic mb-6">
              Architecture du Modèle
            </h3>
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-primary/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  Fusion Historique
                </h4>
                <p className="text-sm text-muted-foreground">
                  Feature engineering sur l'historique des confrontations internationales, pondéré
                  par la récence et l'importance du tournoi.
                </p>
              </div>
              <div className="relative pl-6 border-l-2 border-primary/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  Intégration Classement FIFA
                </h4>
                <p className="text-sm text-muted-foreground">
                  Merge des deux bases de données sur l'ID de l'équipe et la date du classement,
                  alignée sur la date du match.
                </p>
              </div>
              <div className="relative pl-6 border-l-2 border-primary/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  Machine Learning
                </h4>
                <p className="text-sm text-muted-foreground">
                  Trois modèles entraînés et comparés sur la variable cible ; le meilleur est déployé
                  pour produire probabilités et indice de confiance.
                </p>
              </div>
            </div>
            <img
              src={modelViz}
              alt="Visualisation du réseau de neurones sur un terrain de football"
              loading="lazy"
              width={1000}
              height={640}
              className="mt-8 w-full aspect-[16/10] object-cover outline-1 -outline-offset-1 outline-border"
            />
          </div>
        </div>
      </div>
    </section>
  );
}