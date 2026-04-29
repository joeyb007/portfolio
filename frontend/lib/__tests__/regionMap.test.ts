import { getSectionForPoint, REGION_CONFIGS, SECTIONS, CONTENT_SECTIONS } from '../regionMap'

describe('getSectionForPoint', () => {
  it('returns contact for very bottom points', () => {
    expect(getSectionForPoint(0, -0.9, 0)).toBe('contact')
    expect(getSectionForPoint(0, -0.4, 0)).toBe('contact')
  })

  it('returns projects for back-bottom points', () => {
    expect(getSectionForPoint(0, -0.2, -0.3)).toBe('projects')
  })

  it('returns chatbot for left-front-upper points', () => {
    expect(getSectionForPoint(-0.4, 0.2, 0.2)).toBe('chatbot')
  })

  it('returns skills for high crown points', () => {
    expect(getSectionForPoint(0, 0.8, 0)).toBe('skills')
  })

  it('returns blog for back-mid points', () => {
    expect(getSectionForPoint(0, 0.2, -0.4)).toBe('blog')
  })

  it('returns about for front-upper points', () => {
    expect(getSectionForPoint(0, 0.3, 0.3)).toBe('about')
  })

  it('returns personal for center-band points', () => {
    expect(getSectionForPoint(0, 0.05, 0)).toBe('personal')
  })

  it('REGION_CONFIGS covers every section in SECTIONS', () => {
    SECTIONS.forEach((s) => {
      expect(REGION_CONFIGS[s]).toBeDefined()
      expect(REGION_CONFIGS[s].color).toMatch(/^#[0-9a-f]{6}/i)
    })
  })

  it('CONTENT_SECTIONS does not include chatbot', () => {
    expect(CONTENT_SECTIONS).not.toContain('chatbot')
  })
})
