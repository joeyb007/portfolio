// ---------------------------------------------------------------------------
// Mode state machine for the home page (see docs/plans/2026-09-10-recruiter-mode-design.md).
// Pure reducer + resolver so it is unit-testable without React; the storage
// helpers are the only side-effecting exports.
// ---------------------------------------------------------------------------

export type Mode      = 'revealing' | 'animated' | 'minimalistic'
export type SavedMode = 'animated' | 'minimalistic'

export type ModeAction =
  | { type: 'INIT'; saved: SavedMode | null; isMobile: boolean }   // seed after mount (URL/storage/viewport are client-only)
  | { type: 'REVEAL_DONE' }
  | { type: 'TOGGLE' }
  | { type: 'SET_MOBILE'; isMobile: boolean }

export interface ModeState {
  mode:     Mode
  saved:    SavedMode | null   // what storage/URL said, kept even while mobile forces minimalistic
  isMobile: boolean
}

export const MODE_STORAGE_KEY = 'jb-mode'

export function parseMode(v: unknown): SavedMode | null {
  return v === 'animated' || v === 'minimalistic' ? v : null
}

/** URL `?mode=` wins over storage; invalid values are ignored; mobile is always minimalistic. */
export function resolveInitialMode(search: string, saved: string | null, isMobile: boolean): SavedMode | null {
  if (isMobile) return 'minimalistic'
  const fromUrl = parseMode(new URLSearchParams(search).get('mode'))
  return fromUrl ?? parseMode(saved)
}

export function initialModeState(saved: SavedMode | null, isMobile: boolean): ModeState {
  return { mode: 'revealing', saved, isMobile }
}

export const DEFAULT_MODE: SavedMode = 'minimalistic'   // first-time visitors land here after the reveal

/** The mode a non-revealing page should show given what is saved and the viewport. */
function settledMode(saved: SavedMode | null, isMobile: boolean): Mode {
  if (isMobile) return 'minimalistic'
  return saved ?? DEFAULT_MODE
}

export function modeReducer(state: ModeState, action: ModeAction): ModeState {
  switch (action.type) {
    case 'INIT':
      if (state.mode !== 'revealing') return state
      return { ...state, saved: action.saved, isMobile: action.isMobile }

    case 'REVEAL_DONE':
      if (state.mode !== 'revealing') return state
      return { ...state, mode: settledMode(state.saved, state.isMobile) }

    case 'TOGGLE': {
      if (state.isMobile) return state
      if (state.mode === 'revealing') return state
      const next: SavedMode = state.mode === 'animated' ? 'minimalistic' : 'animated'
      return { ...state, mode: next, saved: next }
    }

    case 'SET_MOBILE': {
      if (action.isMobile === state.isMobile) return state
      const mode = state.mode === 'revealing' ? 'revealing' : settledMode(state.saved, action.isMobile)
      return { ...state, mode, isMobile: action.isMobile }
    }

    default:
      return state
  }
}

// Storage helpers — private mode / SSR / quota errors all degrade to "nothing saved".
export function readSavedMode(): SavedMode | null {
  try {
    return parseMode(window.localStorage.getItem(MODE_STORAGE_KEY))
  } catch {
    return null
  }
}

export function saveMode(m: SavedMode): void {
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, m)
  } catch {
    // ignore
  }
}
