/**
 * supabase.ts — Client Supabase pour le frontend World Cup App
 *
 * Ce fichier configure la connexion au projet Supabase qui héberge:
 * - Les statistiques des équipes (team_current_stats)
 * - L'historique H2H (h2h_stats)
 * - L'Edge Function de prédiction (/functions/v1/predict)
 *
 * Note: Utilise fetch natif au lieu d'une dépendance pour éviter les problèmes de build
 */

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xafwxhhsoewaelnzhwqe.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// URL de l'Edge Function de prédiction
export const PREDICT_FUNCTION_URL = `${supabaseUrl}/functions/v1/predict`

/**
 * Types pour les données Supabase
 */

export interface TeamStats {
  team: string
  last_match_date: string | null
  form_points_avg_5: number | null
  form_points_avg_10: number | null
  goals_for_avg_5: number | null
  goals_against_avg_5: number | null
  win_rate_alltime: number | null
  matches_played_before: number | null
  rank_date: string | null
  fifa_rank: number | null
  fifa_points: number | null
  rank_change: number | null
  points_change: number | null
  rank_avg_last3: number | null
  points_avg_last3: number | null
  confederation: string | null
  updated_at: string
}

export interface H2HStats {
  team_a: string
  team_b: string
  matches_played: number
  team_a_wins: number
  team_b_wins: number
  draws: number
  updated_at: string
}

export interface PredictionRequest {
  home_team: string
  away_team: string
  match_date: string // YYYY-MM-DD
  neutral?: boolean
  competition_type?: string
}

export interface PredictionResponse {
  home_team: string
  away_team: string
  probabilities: {
    'Home Win': number
    'Draw': number
    'Away Win': number
  }
  predicted_result: string
  warnings: string[]
  metadata?: {
    home_stats?: TeamStats
    away_stats?: TeamStats
    h2h?: H2HStats
    factors_used: string[]
  }
}

export interface PredictionRecord {
  id: string
  home_team: string
  away_team: string
  match_date: string
  neutral: boolean
  competition_type: string
  predicted_result: string
  probabilities: {
    'Home Win': number
    'Draw': number
    'Away Win': number
  }
  warnings: string[]
  created_at: string
}

/**
 * Fonction helper pour les requêtes Supabase via REST API
 */
async function supabaseFetch<T>(
  table: string,
  options: {
    select?: string
    eq?: [string, string | number][]
    order?: { column: string; ascending?: boolean }
    limit?: number
    single?: boolean
  } = {}
): Promise<T | T[] | null> {
  const params = new URLSearchParams()

  if (options.select) params.append('select', options.select)
  if (options.eq) {
    options.eq.forEach(([column, value]) => params.append(column, `eq.${value}`))
  }
  if (options.order) {
    params.append('order', `${options.order.column}${options.order.ascending ? '.asc' : '.desc'}`)
  }
  if (options.limit) params.append('limit', options.limit.toString())

  const url = `${supabaseUrl}/rest/v1/${table}?${params.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`Supabase fetch error: ${response.status} - ${error}`)
      return null
    }

    const data = await response.json()
    return options.single ? (data as T[])[0] || null : data
  } catch (error) {
    console.error('Supabase fetch error:', error)
    return null
  }
}

/**
 * Récupère les statistiques d'une équipe
 */
export async function getTeamStats(teamName: string): Promise<TeamStats | null> {
  return supabaseFetch<TeamStats>('team_current_stats', {
    eq: [['team', teamName]],
    single: true,
  }) as Promise<TeamStats | null>
}

/**
 * Récupère les stats H2H entre deux équipes
 */
export async function getH2HStats(teamA: string, teamB: string): Promise<H2HStats | null> {
  // Les stats H2H sont stockées avec les noms triés alphabétiquement
  const [a, b] = [teamA, teamB].sort()

  return supabaseFetch<H2HStats>('h2h_stats', {
    eq: [['team_a', a], ['team_b', b]],
    single: true,
  }) as Promise<H2HStats | null>
}

/**
 * Appelle l'Edge Function de prédiction
 */
export async function predictMatch(
  request: PredictionRequest
): Promise<PredictionResponse> {
  const response = await fetch(PREDICT_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Prediction failed (${response.status}): ${error}`)
  }

  return response.json()
}

/**
 * Récupère l'historique des prédictions
 */
export async function getPredictions(limit = 50): Promise<PredictionRecord[]> {
  const result = await supabaseFetch<PredictionRecord>('predictions', {
    order: { column: 'created_at', ascending: false },
    limit,
  })

  return (result as PredictionRecord[]) || []
}
