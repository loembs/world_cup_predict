/**
 * predictions.ts — Service de prédiction connecté au backend Supabase
 *
 * Ce fichier fournit une interface pour les prédictions qui peut:
 * - Soit appeler l'Edge Function Supabase (mode production)
 * - Soit utiliser le calcul local (mode dégradé/fallback)
 */

import type { Team, Prediction } from './teams'
import { predictMatch as supabasePredict, type PredictionResponse } from './supabase'
import { predictMatch as localPredict } from './teams'

/**
 * Configuration du mode de prédiction
 */
export type PredictionMode = 'supabase' | 'local' | 'auto'

let predictionMode: PredictionMode = 'auto' // Auto = tente Supabase, fallback sur local

/**
 * Définit le mode de prédiction
 */
export function setPredictionMode(mode: PredictionMode) {
  predictionMode = mode
}

/**
 * Récupère le mode de prédiction actuel
 */
export function getPredictionMode(): PredictionMode {
  return predictionMode
}

/**
 * Convertit une réponse Supabase enPrediction locale
 */
function convertSupabaseToLocal(response: PredictionResponse): Prediction {
  const { probabilities } = response

  // Calcul de la confiance basée sur la plus haute probabilité
  const maxProb = Math.max(
    probabilities['Home Win'],
    probabilities['Draw'],
    probabilities['Away Win']
  )
  const confidence = Math.round((0.5 + maxProb * 0.5) * 100) / 10

  return {
    homeWin: Math.round(probabilities['Home Win'] * 1000) / 10,
    draw: Math.round(probabilities['Draw'] * 1000) / 10,
    awayWin: Math.round(probabilities['Away Win'] * 1000) / 10,
    confidence,
  }
}

/**
 * Effectue une prédiction de match
 *
 * @param home - Équipe à domicile
 * @param away - Équipe à l'extérieur
 * @param options - Options de prédiction
 * @returns La prédiction avec les probabilités
 */
export async function predictMatchWithSupabase(
  home: Team,
  away: Team,
  options?: {
    matchDate?: string // Format YYYY-MM-DD, défaut: aujourd'hui
    neutral?: boolean
    competitionType?: string
  }
): Promise<{ prediction: Prediction; source: 'supabase' | 'local'; warnings?: string[] }> {
  const matchDate = options?.matchDate || new Date().toISOString().split('T')[0]

  // Mode local forcé
  if (predictionMode === 'local') {
    return {
      prediction: localPredict(home, away),
      source: 'local',
    }
  }

  // Mode Supabase (ou auto)
  try {
    const response = await supabasePredict({
      home_team: home.name,
      away_team: away.name,
      match_date: matchDate,
      neutral: options?.neutral ?? false,
      competition_type: options?.competitionType || 'Friendly',
    })

    return {
      prediction: convertSupabaseToLocal(response),
      source: 'supabase',
      warnings: response.warnings,
    }
  } catch (error) {
    console.warn('Supabase prediction failed, falling back to local:', error)

    // Fallback en mode auto
    if (predictionMode === 'auto') {
      return {
        prediction: localPredict(home, away),
        source: 'local',
        warnings: ['Backend unavailable — using local prediction'],
      }
    }

    throw error
  }
}

/**
 * Hook React pour les prédictions (si tu veux l'utiliser dans les composants)
 */
export function usePrediction() {
  return {
    predict: predictMatchWithSupabase,
    mode: predictionMode,
    setMode: setPredictionMode,
  }
}

/**
 * Types additionnels pour les réponses étendues
 */
export type PredictionResult = {
  prediction: Prediction
  source: 'supabase' | 'local'
  warnings?: string[]
  metadata?: PredictionResponse['metadata']
}
