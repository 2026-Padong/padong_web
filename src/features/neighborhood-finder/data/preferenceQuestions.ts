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
}

export const PREFERENCE_QUESTIONS: PreferenceQuestion[] = [
  {
    id: 1,
    question: '주말에 나는?',
    subtitle: '평소 휴일 보내는 방식을 알려주세요',
    left: { emoji: '🛏️', title: '침대가 나의 성지', description: '집순이 모드, 휴식이 최고' },
    right: {
      emoji: '🌍',
      title: '밖에 나가야 살아있는 느낌',
      description: '활동적이고 에너지가 넘쳐요',
    },
  },
  {
    id: 2,
    question: '평소 나의 연락 스타일은?',
    subtitle: '메시지·전화에 어떻게 반응하시나요',
    left: { emoji: '📵', title: '카톡 읽고 묵힘', description: '연락은 최소한으로' },
    right: { emoji: '📲', title: '먼저 연락하고', description: '답장도 칼같이' },
  },
  {
    id: 3,
    question: '저녁 시간대 동네 분위기는?',
    subtitle: '집 근처가 어떤 모습이면 좋을까요',
    left: { emoji: '🌙', title: '조용한 골목', description: '소음 없고 차분한 게 좋아요' },
    right: { emoji: '🍻', title: '활기찬 거리', description: '저녁에도 사람이 많고 활기 있어요' },
  },
  {
    id: 4,
    question: '주말 약속 장소는?',
    subtitle: '친구를 만날 때 선호하는 동네 분위기',
    left: { emoji: '🌳', title: '공원·산책길', description: '자연과 가까운 곳에서 여유롭게' },
    right: { emoji: '🛍️', title: '핫플 거리', description: '카페·맛집 가득한 핫플에서' },
  },
  {
    id: 5,
    question: '동네에서 가장 중요한 건?',
    subtitle: '주거지를 고를 때 우선순위',
    left: { emoji: '🛡️', title: '치안·안전', description: '늦은 시간에도 안심할 수 있어야' },
    right: { emoji: '🚇', title: '교통 편의', description: '어디든 빠르게 이동할 수 있어야' },
  },
  {
    id: 6,
    question: '월세·생활비는?',
    subtitle: '주거비 지출 성향을 알려주세요',
    left: { emoji: '💰', title: '최대한 저렴하게', description: '주거비는 최소화하고 싶어요' },
    right: { emoji: '✨', title: '비싸도 만족도 높게', description: '환경·편의에 투자해요' },
  },
  {
    id: 7,
    question: '통근 시간이라면?',
    subtitle: '직장·학교까지의 이동 시간',
    left: { emoji: '⚡', title: '30분 이내 필수', description: '시간이 곧 돈, 가까울수록 좋아요' },
    right: { emoji: '🚌', title: '1시간도 OK', description: '환경이 좋다면 거리는 감수해요' },
  },
  {
    id: 8,
    question: '편의시설이 가까웠으면?',
    subtitle: '마트·병원·은행 도보권 여부',
    left: { emoji: '🏪', title: '도보 5분 안에', description: '일상이 동네 안에서 완결되어야' },
    right: { emoji: '🚗', title: '차로 가면 충분', description: '필요할 때만 잠깐 다녀와요' },
  },
  {
    id: 9,
    question: '문화·여가 시설은?',
    subtitle: '영화관·서점·운동시설 등',
    left: { emoji: '📺', title: '집에서도 충분', description: '구독 서비스로 다 해결돼요' },
    right: { emoji: '🎬', title: '가까운 곳에 있어야', description: '직접 가서 즐기는 게 좋아요' },
  },
  {
    id: 10,
    question: '동네의 분위기는?',
    subtitle: '오래 살고 싶은 동네 성격',
    left: { emoji: '🌿', title: '조용한 주거 동네', description: '거주민 위주, 여유로운 곳' },
    right: {
      emoji: '🎉',
      title: '활기찬 핫플 동네',
      description: '유동인구 많고 새로운 곳이 자주 생겨요',
    },
  },
]
