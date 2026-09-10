import {
  modeReducer,
  resolveInitialMode,
  readSavedMode,
  saveMode,
  parseMode,
  initialModeState,
  DEFAULT_MODE,
  MODE_STORAGE_KEY,
  type ModeState,
} from '../mode'

const desktop = (overrides: Partial<ModeState> = {}): ModeState => ({
  mode: 'revealing', saved: null, isMobile: false, ...overrides,
})

describe('parseMode', () => {
  it('accepts the two saved modes', () => {
    expect(parseMode('animated')).toBe('animated')
    expect(parseMode('minimalistic')).toBe('minimalistic')
  })
  it('rejects everything else', () => {
    expect(parseMode('revealing')).toBeNull()
    expect(parseMode('')).toBeNull()
    expect(parseMode(null)).toBeNull()
    expect(parseMode(undefined)).toBeNull()
    expect(parseMode(42)).toBeNull()
    expect(parseMode('ANIMATED')).toBeNull()
  })
})

describe('resolveInitialMode', () => {
  it('returns null when nothing is saved and no URL param', () => {
    expect(resolveInitialMode('', null, false)).toBeNull()
    expect(resolveInitialMode('?foo=bar', null, false)).toBeNull()
  })
  it('uses the saved mode when the URL has none', () => {
    expect(resolveInitialMode('', 'animated', false)).toBe('animated')
    expect(resolveInitialMode('', 'minimalistic', false)).toBe('minimalistic')
  })
  it('URL wins over saved', () => {
    expect(resolveInitialMode('?mode=animated', 'minimalistic', false)).toBe('animated')
    expect(resolveInitialMode('?mode=minimalistic', 'animated', false)).toBe('minimalistic')
  })
  it('ignores an invalid ?mode= and falls back to saved', () => {
    expect(resolveInitialMode('?mode=bogus', 'animated', false)).toBe('animated')
    expect(resolveInitialMode('?mode=', 'animated', false)).toBe('animated')
    expect(resolveInitialMode('?mode=bogus', null, false)).toBeNull()
  })
  it('ignores an invalid saved value', () => {
    expect(resolveInitialMode('', 'garbage', false)).toBeNull()
  })
  it('mobile always resolves to minimalistic', () => {
    expect(resolveInitialMode('?mode=animated', 'animated', true)).toBe('minimalistic')
    expect(resolveInitialMode('', null, true)).toBe('minimalistic')
  })
})

describe('initialModeState', () => {
  it('starts in revealing with the resolved saved mode', () => {
    expect(initialModeState('animated', false)).toEqual({ mode: 'revealing', saved: 'animated', isMobile: false })
    expect(initialModeState(null, true)).toEqual({ mode: 'revealing', saved: null, isMobile: true })
  })
})

describe('modeReducer — transition table', () => {
  it('(init) page mounts -> revealing', () => {
    expect(initialModeState(null, false).mode).toBe('revealing')
  })

  it('revealing + REVEAL_DONE with a saved mode -> that mode', () => {
    expect(modeReducer(desktop({ saved: 'animated' }), { type: 'REVEAL_DONE' }).mode).toBe('animated')
    expect(modeReducer(desktop({ saved: 'minimalistic' }), { type: 'REVEAL_DONE' }).mode).toBe('minimalistic')
  })

  it('revealing + REVEAL_DONE with nothing saved -> the default (minimalistic), not saved', () => {
    expect(modeReducer(desktop(), { type: 'REVEAL_DONE' })).toEqual({ mode: DEFAULT_MODE, saved: null, isMobile: false })
    expect(DEFAULT_MODE).toBe('minimalistic')
  })

  it('revealing + REVEAL_DONE on mobile -> minimalistic, regardless of saved', () => {
    const s = modeReducer(desktop({ isMobile: true, saved: 'animated' }), { type: 'REVEAL_DONE' })
    expect(s.mode).toBe('minimalistic')
    expect(s.saved).toBe('animated') // not overwritten
  })

  it('REVEAL_DONE outside revealing is a no-op', () => {
    const s = desktop({ mode: 'animated', saved: 'animated' })
    expect(modeReducer(s, { type: 'REVEAL_DONE' })).toBe(s)
  })

  it('animated + TOGGLE -> minimalistic (saved)', () => {
    const s = modeReducer(desktop({ mode: 'animated', saved: 'animated' }), { type: 'TOGGLE' })
    expect(s).toEqual({ mode: 'minimalistic', saved: 'minimalistic', isMobile: false })
  })

  it('minimalistic + TOGGLE -> animated (saved)', () => {
    const s = modeReducer(desktop({ mode: 'minimalistic', saved: 'minimalistic' }), { type: 'TOGGLE' })
    expect(s).toEqual({ mode: 'animated', saved: 'animated', isMobile: false })
  })

  it('TOGGLE in revealing is a no-op', () => {
    const rev = desktop()
    expect(modeReducer(rev, { type: 'TOGGLE' })).toBe(rev)
  })

  it('first TOGGLE from the unsaved default saves the other mode', () => {
    const landed = modeReducer(desktop(), { type: 'REVEAL_DONE' })
    expect(modeReducer(landed, { type: 'TOGGLE' })).toEqual({ mode: 'animated', saved: 'animated', isMobile: false })
  })

  it('TOGGLE on mobile is a no-op (mode is forced)', () => {
    const s = desktop({ mode: 'minimalistic', saved: 'animated', isMobile: true })
    expect(modeReducer(s, { type: 'TOGGLE' })).toBe(s)
  })
})

describe('modeReducer — mobile flips', () => {
  it('SET_MOBILE true forces minimalistic without touching saved', () => {
    const s = modeReducer(desktop({ mode: 'animated', saved: 'animated' }), { type: 'SET_MOBILE', isMobile: true })
    expect(s).toEqual({ mode: 'minimalistic', saved: 'animated', isMobile: true })
  })

  it('SET_MOBILE true while revealing keeps revealing but records isMobile', () => {
    const s = modeReducer(desktop({ saved: 'animated' }), { type: 'SET_MOBILE', isMobile: true })
    expect(s).toEqual({ mode: 'revealing', saved: 'animated', isMobile: true })
    // and the reveal then lands on minimalistic
    expect(modeReducer(s, { type: 'REVEAL_DONE' }).mode).toBe('minimalistic')
  })

  it('SET_MOBILE false restores the saved mode', () => {
    const forced: ModeState = { mode: 'minimalistic', saved: 'animated', isMobile: true }
    expect(modeReducer(forced, { type: 'SET_MOBILE', isMobile: false }))
      .toEqual({ mode: 'animated', saved: 'animated', isMobile: false })
  })

  it('SET_MOBILE false with nothing saved goes to the default', () => {
    const forced: ModeState = { mode: 'minimalistic', saved: null, isMobile: true }
    expect(modeReducer(forced, { type: 'SET_MOBILE', isMobile: false }))
      .toEqual({ mode: DEFAULT_MODE, saved: null, isMobile: false })
  })

  it('SET_MOBILE false while revealing keeps revealing', () => {
    const s: ModeState = { mode: 'revealing', saved: null, isMobile: true }
    expect(modeReducer(s, { type: 'SET_MOBILE', isMobile: false }))
      .toEqual({ mode: 'revealing', saved: null, isMobile: false })
  })

  it('SET_MOBILE with no change is a no-op', () => {
    const s = desktop({ mode: 'animated', saved: 'animated' })
    expect(modeReducer(s, { type: 'SET_MOBILE', isMobile: false })).toBe(s)
  })
})

describe('storage helpers', () => {
  beforeEach(() => { window.localStorage.clear(); jest.restoreAllMocks() })

  it('round-trips through localStorage under the jb-mode key', () => {
    expect(MODE_STORAGE_KEY).toBe('jb-mode')
    expect(readSavedMode()).toBeNull()
    saveMode('animated')
    expect(window.localStorage.getItem('jb-mode')).toBe('animated')
    expect(readSavedMode()).toBe('animated')
  })

  it('ignores garbage in storage', () => {
    window.localStorage.setItem('jb-mode', 'nope')
    expect(readSavedMode()).toBeNull()
  })

  it('swallows a throwing getItem and reports nothing saved', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
    expect(readSavedMode()).toBeNull()
  })

  it('swallows a throwing setItem', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
    expect(() => saveMode('minimalistic')).not.toThrow()
  })
})

describe('INIT', () => {
  it('seeds saved and isMobile while still revealing', () => {
    const s = modeReducer(desktop(), { type: 'INIT', saved: 'minimalistic', isMobile: false })
    expect(s).toEqual({ mode: 'revealing', saved: 'minimalistic', isMobile: false })
  })
  it('then REVEAL_DONE lands on the seeded mode', () => {
    const s = modeReducer(desktop(), { type: 'INIT', saved: 'animated', isMobile: false })
    expect(modeReducer(s, { type: 'REVEAL_DONE' }).mode).toBe('animated')
  })
  it('mobile seed forces minimalistic on REVEAL_DONE regardless of saved', () => {
    const s = modeReducer(desktop(), { type: 'INIT', saved: 'animated', isMobile: true })
    expect(modeReducer(s, { type: 'REVEAL_DONE' }).mode).toBe('minimalistic')
  })
  it('is ignored once past revealing', () => {
    const s = desktop({ mode: 'animated', saved: 'animated' })
    expect(modeReducer(s, { type: 'INIT', saved: 'minimalistic', isMobile: false })).toBe(s)
  })
})
