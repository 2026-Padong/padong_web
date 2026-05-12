// 영업 요일 — bit0=MON .. bit6=SUN, 0~127
export const DAYS = ['월', '화', '수', '목', '금', '토', '일']

export type WeekdayPreset = 'WEEKDAY' | 'WEEKEND' | 'EVERYDAY' | 'CUSTOM'
export const PRESET_LABEL: Record<WeekdayPreset, string> = {
  WEEKDAY: '평일',
  WEEKEND: '주말',
  EVERYDAY: '매일',
  CUSTOM: '커스텀',
}

export function maskToWeekdays(mask: number): boolean[] {
  return Array.from({ length: 7 }, (_, i) => (mask & (1 << i)) !== 0)
}

export function weekdaysToMask(days: boolean[]): number {
  return days.reduce((acc, v, i) => (v ? acc | (1 << i) : acc), 0)
}

export function getWeekdayPreset(days: boolean[]): WeekdayPreset {
  const sig = days.map((v) => (v ? 1 : 0)).join('')
  if (sig === '1111100') return 'WEEKDAY'
  if (sig === '0000011') return 'WEEKEND'
  if (sig === '1111111') return 'EVERYDAY'
  return 'CUSTOM'
}

// "평일" / "주말" / "매일" / "(월, 화, 수)"
export function formatWeekdaysParen(days: boolean[]): string {
  const p = getWeekdayPreset(days)
  if (p !== 'CUSTOM') return PRESET_LABEL[p]
  const picked = days.map((v, i) => (v ? DAYS[i] : null)).filter(Boolean) as string[]
  return picked.length === 0 ? '미지정' : `(${picked.join(', ')})`
}
