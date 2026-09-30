// 백엔드 AI 가 반환하는 userType (예: "힐링 감성형") → 이모지 + 트레이트 + 샘플 동네 매핑.
// 8가지 핵심 유형 정의 (백엔드 enum 과 1:1).

export interface UserTypeMeta {
  emoji: string
  /** 트레이트 뉘앙스를 살린 한 문장 (서브텍스트로 노출) */
  description: string
}

export const USER_TYPE_META: Record<string, UserTypeMeta> = {
  '핫플 탐험가형':       { emoji: '🔥', description: '사람과 활기 있는 분위기를 즐기는 타입' },
  '감성 사교형':         { emoji: '🎉', description: '감성적인 공간에서 가까운 사람들과 어울리는 타입' },
  '골목 탐험가형':       { emoji: '🧭', description: '혼자 골목을 누비며 발견하는 걸 좋아하는 타입' },
  '힐링 감성형':         { emoji: '🌿', description: '조용히 나만의 시간을 즐기는 타입' },
  '현실 라이프형':       { emoji: '🏙️', description: '편안하고 실속 있는 일상을 추구하는 타입' },
  '효율 생활형':         { emoji: '🚀', description: '효율적인 동선과 일상을 선호하는 타입' },
  '네트워킹형':          { emoji: '🤝', description: '사람들과 어울리며 부지런히 움직이는 타입' },
  '균형 잡힌 올라운더형': { emoji: '🎈', description: '어디서든 잘 어울리는 균형 잡힌 타입' },
}

export interface ResolvedUserType {
  emoji: string
  /** 이모지 + 라벨 한 줄 (예: "🌿 힐링 감성형") */
  display: string
  /** 본 라벨만 (이모지 제외) */
  label: string
  /** 부가 설명 (트레이트 + 샘플) — 한 줄 (예: "휴식 · 혼자 · 취향 · 북촌, 서촌 같은 동네") */
  description: string
}

export function resolveUserType(userType: string | undefined | null): ResolvedUserType {
  const fallbackLabel = '내 취향 분석'
  if (!userType) {
    return { emoji: '✨', display: fallbackLabel, label: fallbackLabel, description: '' }
  }
  const meta = USER_TYPE_META[userType]
  if (!meta) {
    return { emoji: '✨', display: userType, label: userType, description: '' }
  }
  return {
    emoji: meta.emoji,
    display: `${meta.emoji} ${userType}`,
    label: userType,
    description: meta.description,
  }
}
