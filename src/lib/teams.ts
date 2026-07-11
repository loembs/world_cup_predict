export interface Team {
  code: string;
  name: string;
  flag: string; // URL d'image de drapeau
  rank: number;
  points: number;
  evolution: number;
}

export const TEAMS: Team[] = [
  { code: "ARG", name: "Argentine", flag: "https://flagcdn.com/w80/ar.png", rank: 1, points: 1867.25, evolution: 1 },
  { code: "FRA", name: "France", flag: "https://flagcdn.com/w80/fr.png", rank: 2, points: 1859.78, evolution: -1 },
  { code: "ESP", name: "Espagne", flag: "https://flagcdn.com/w80/es.png", rank: 3, points: 1853.27, evolution: 2 },
  { code: "ENG", name: "Angleterre", flag: "https://flagcdn.com/w80/gb-eng.png", rank: 4, points: 1813.81, evolution: 0 },
  { code: "BRA", name: "Brésil", flag: "https://flagcdn.com/w80/br.png", rank: 5, points: 1775.85, evolution: -1 },
  { code: "POR", name: "Portugal", flag: "https://flagcdn.com/w80/pt.png", rank: 6, points: 1770.51, evolution: 1 },
  { code: "NED", name: "Pays-Bas", flag: "https://flagcdn.com/w80/nl.png", rank: 7, points: 1749.44, evolution: 0 },
  { code: "BEL", name: "Belgique", flag: "https://flagcdn.com/w80/be.png", rank: 8, points: 1740.01, evolution: -2 },
  { code: "ITA", name: "Italie", flag: "https://flagcdn.com/w80/it.png", rank: 9, points: 1731.94, evolution: 1 },
  { code: "GER", name: "Allemagne", flag: "https://flagcdn.com/w80/de.png", rank: 10, points: 1724.83, evolution: 3 },
  { code: "CRO", name: "Croatie", flag: "https://flagcdn.com/w80/hr.png", rank: 11, points: 1710.15, evolution: -1 },
  { code: "MAR", name: "Maroc", flag: "https://flagcdn.com/w80/ma.png", rank: 12, points: 1694.24, evolution: 1 },
  { code: "URU", name: "Uruguay", flag: "https://flagcdn.com/w80/uy.png", rank: 13, points: 1679.49, evolution: -1 },
  { code: "COL", name: "Colombie", flag: "https://flagcdn.com/w80/co.png", rank: 14, points: 1679.04, evolution: 0 },
  { code: "JPN", name: "Japon", flag: "https://flagcdn.com/w80/jp.png", rank: 15, points: 1652.79, evolution: 2 },
  { code: "USA", name: "États-Unis", flag: "https://flagcdn.com/w80/us.png", rank: 16, points: 1648.81, evolution: -1 },
  { code: "MEX", name: "Mexique", flag: "https://flagcdn.com/w80/mx.png", rank: 17, points: 1646.94, evolution: -1 },
  { code: "SEN", name: "Sénégal", flag: "https://flagcdn.com/w80/sn.png", rank: 18, points: 1623.34, evolution: 1 },
  { code: "SUI", name: "Suisse", flag: "https://flagcdn.com/w80/ch.png", rank: 19, points: 1614.62, evolution: -1 },
  { code: "DEN", name: "Danemark", flag: "https://flagcdn.com/w80/dk.png", rank: 20, points: 1601.19, evolution: 0 },
  { code: "CIV", name: "Côte d'Ivoire", flag: "https://flagcdn.com/w80/ci.png", rank: 38, points: 1487.36, evolution: 2 },
  { code: "NGA", name: "Nigéria", flag: "https://flagcdn.com/w80/ng.png", rank: 43, points: 1471.65, evolution: -1 },
  { code: "CMR", name: "Cameroun", flag: "https://flagcdn.com/w80/cm.png", rank: 49, points: 1447.15, evolution: 1 },
  { code: "ALG", name: "Algérie", flag: "https://flagcdn.com/w80/dz.png", rank: 36, points: 1497.5, evolution: 0 },
  { code: "EGY", name: "Égypte", flag: "https://flagcdn.com/w80/eg.png", rank: 33, points: 1508.99, evolution: 1 },
];

export interface Prediction {
  homeWin: number;
  draw: number;
  awayWin: number;
  confidence: number;
}

/**
 * Prédiction basée sur l'écart de points FIFA (modèle Elo simplifié),
 * en attendant le branchement du vrai modèle ML.
 */
export function predictMatch(home: Team, away: Team): Prediction {
  const diff = home.points - away.points;
  // Probabilité Elo classique avec léger avantage domicile
  const pHomeRaw = 1 / (1 + Math.pow(10, -(diff + 60) / 400));
  // Part de nul décroissante quand l'écart grandit
  const draw = 0.28 * Math.exp(-Math.abs(diff) / 500);
  const homeWin = pHomeRaw * (1 - draw);
  const awayWin = (1 - pHomeRaw) * (1 - draw);
  const confidence = 0.7 + Math.min(Math.abs(diff) / 400, 1) * 0.25;

  return {
    homeWin: Math.round(homeWin * 1000) / 10,
    draw: Math.round(draw * 1000) / 10,
    awayWin: Math.round(awayWin * 1000) / 10,
    confidence: Math.round(confidence * 1000) / 10,
  };
}