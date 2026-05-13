// 비로그인 유저용 q1~q10 답변 백업.
// 로그인 유저는 백엔드가 entity 로 저장 (/api/preference/me/answers). 비로그인은 DB 키가 없으니 localStorage 폴백.
// 로그인 후 마이그레이션: 첫 /dongne/recommendations 호출 시 백엔드가 자동 저장하므로 별도 sync 불필요.

import type { PreferenceAnswersResponse } from '@/api/preference'

const KEY = 'padong:preference:answers:v1'

export type PreferenceAnswersLocal = Omit<PreferenceAnswersResponse, 'updatedAt'> & {
  updatedAt: string
}

export function savePreferenceAnswers(answers: Record<number, number>): void {
  const required = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  for (const i of required) {
    if (answers[i] == null) return // 부분 답변은 저장 안 함
  }
  const out: PreferenceAnswersLocal = {
    q1: answers[1], q2: answers[2], q3: answers[3], q4: answers[4], q5: answers[5],
    q6: answers[6], q7: answers[7], q8: answers[8], q9: answers[9], q10: answers[10],
    updatedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(out))
  } catch {
    // QuotaExceeded 등 무시
  }
}

export function loadPreferenceAnswers(): PreferenceAnswersLocal | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PreferenceAnswersLocal
    if (typeof parsed.q1 !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export function clearPreferenceAnswers(): void {
  try { localStorage.removeItem(KEY) } catch { /* noop */ }
}
