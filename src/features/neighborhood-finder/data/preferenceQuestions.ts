export interface PreferencePole {
  emoji: string
  title: string
  description: string
}

export interface PreferenceQuestion {
  id: number
  /** Figma 형식: "주말에 나는?" 같은 짧은 질문 */
  question: string
  subtitle?: string
  left: PreferencePole
  right: PreferencePole
  /** 카테고리 태그 (집돌이/재테크/혼잡도/쇼핑/배달/영상서비스 …) — 결과 분석용 */
  tag?: string
}

export const PREFERENCE_QUESTIONS: PreferenceQuestion[] = [
  {
    id: 1,
    question: '주말에 나는?',
    subtitle: '평소 휴일 보내는 방식을 알려주세요',
    left: { emoji: '🛋️', title: '침대가 나의 성지', description: '집에서 푹 쉬는 게 제일 행복해요' },
    right: { emoji: '🌍', title: '밖에 나가야 살아있는 느낌', description: '활동적이고 에너지가 넘쳐요' },
    tag: '집돌이',
  },
  {
    id: 2,
    question: '평소 나의 연락 스타일은?',
    subtitle: '메시지·전화에 어떻게 반응하시나요',
    left: { emoji: '📵', title: '카톡 읽고 묵힘', description: '연락은 최소한, 답장은 천천히' },
    right: { emoji: '📲', title: '먼저 연락하고', description: '답장도 빠르게 칼같이 보내요' },
  },
  {
    id: 3,
    question: '연락할 때 주로?',
    subtitle: '전화와 메시지 중 어느 쪽이 편한가요',
    left: { emoji: '💬', title: '문자·카톡으로 충분', description: '전화는 부담스러워요' },
    right: { emoji: '📞', title: '타이핑보다 전화가 빠름', description: '용건은 바로 전화로 해결해요' },
  },
  {
    id: 4,
    question: '월급날 내 행동은?',
    subtitle: '돈 관리 성향을 알려주세요',
    left: { emoji: '💳', title: '들어오는 족족 나감', description: '잔고는 거의 안 봐요' },
    right: { emoji: '📊', title: '주식앱·가계부 매일 확인', description: '돈 관리가 일상이에요' },
    tag: '재테크',
  },
  {
    id: 5,
    question: '지하철 칸이 꽉 찼을 때 나는?',
    subtitle: '혼잡에 대한 내 반응은',
    left: { emoji: '⏰', title: '다음 열차 기다림', description: '여유롭게 가는 게 좋아요' },
    right: { emoji: '🐟', title: '일단 몸부터 들이밀고 봄', description: '시간이 더 중요해요' },
    tag: '혼잡도',
  },
  {
    id: 6,
    question: '내 옷장은?',
    subtitle: '옷 사는 빈도와 패션 성향',
    left: { emoji: '🪨', title: '작년이나 올해나 똑같은 옷', description: '검증된 옷만 입어요' },
    right: { emoji: '🛍️', title: '매일 다른 옷', description: '중복 착장은 못 견뎌요' },
    tag: '쇼핑',
  },
  {
    id: 7,
    question: '저녁 메뉴 결정은?',
    subtitle: '요리와 배달 중 더 가까운 쪽은',
    left: { emoji: '👨‍🍳', title: '냉장고 열어서 뚝딱', description: '요리가 힐링이에요' },
    right: { emoji: '🛵', title: '앱 열고 리뷰 보며 고르는 게 취미', description: '배달이 일상이에요' },
    tag: '배달',
  },
  {
    id: 8,
    question: '퇴근 후 루틴은?',
    subtitle: '퇴근 후 시간 보내는 방식',
    left: { emoji: '📵', title: '폰 내려놓고 다른 걸 함', description: '영상은 가끔만 봐요' },
    right: { emoji: '🎬', title: '유튜브·넷플 없으면 잠을 못 잠', description: '영상 콘텐츠가 일상이에요' },
    tag: '영상서비스',
  },
  {
    id: 9,
    question: '노는 동네가?',
    subtitle: '주로 어디서 놀고 시간을 보내나요',
    left: { emoji: '🏘️', title: '우리 동네 단골집만', description: '1년째 같은 골목에서 놀아요' },
    right: { emoji: '🧭', title: '매주 다른 동네 핫플 탐방이 루틴', description: '새로운 동네를 찾아다녀요' },
  },
  {
    id: 10,
    question: '이상적인 동네는?',
    subtitle: '오래 살고 싶은 동네 성격',
    left: { emoji: '🌿', title: '조용하고 한적함', description: '카페 하나만 있으면 충분해요' },
    right: { emoji: '🎉', title: '맛집·바·편의점 가득한 번화가 한복판', description: '활기찬 번화가가 좋아요' },
  },
]
