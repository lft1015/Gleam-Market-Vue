import { describe, expect, it } from 'vitest'
import { formatMoney, parseImages, statusLabels } from '../format'

describe('format utilities', () => {
  it('parses current and legacy image formats', () => {
    expect(parseImages('["/a.jpg","/b.jpg"]')).toEqual(['/a.jpg', '/b.jpg'])
    expect(parseImages('/a.jpg, /b.jpg')).toEqual(['/a.jpg', '/b.jpg'])
    expect(parseImages('/a.jpg')).toEqual(['/a.jpg'])
  })
  it('formats money and status labels', () => {
    expect(formatMoney(12)).toBe('¥12.00')
    expect(statusLabels.PENDING_REVIEW).toBe('待审核')
  })
})
