export interface PreferenceQuestion {
  id: number
  question: string
  subtitle?: string
}

export const PREFERENCE_QUESTIONS: PreferenceQuestion[] = [
  {
    id: 1,
    question: '조용한 동네에서 살고 싶나요?',
    subtitle: '소음이 적고 차분한 환경을 선호합니다',
  },
  {
    id: 2,
    question: '대중교통 접근성이 중요한가요?',
    subtitle: '지하철·버스 정류장이 가까운 곳을 선호합니다',
  },
  {
    id: 3,
    question: '카페·맛집이 많은 동네를 선호하나요?',
    subtitle: '걸어서 갈 수 있는 핫플레이스가 중요합니다',
  },
  {
    id: 4,
    question: '공원·녹지 공간이 가까웠으면 하나요?',
    subtitle: '산책·운동할 수 있는 자연 환경을 선호합니다',
  },
  {
    id: 5,
    question: '치안·안전이 가장 중요한 기준인가요?',
    subtitle: '안심하고 다닐 수 있는 환경이 우선입니다',
  },
  {
    id: 6,
    question: '월세·관리비 부담을 최소화하고 싶나요?',
    subtitle: '주거비를 합리적으로 유지하는 게 중요합니다',
  },
  {
    id: 7,
    question: '직장·학교까지 통근 시간이 짧아야 하나요?',
    subtitle: '30분 이내 이동 가능한 거리를 선호합니다',
  },
  {
    id: 8,
    question: '편의시설(마트·병원·은행)이 풍부해야 하나요?',
    subtitle: '일상 편의시설이 도보권에 있어야 합니다',
  },
  {
    id: 9,
    question: '문화·여가 시설이 가까웠으면 하나요?',
    subtitle: '영화관·서점·운동시설을 자주 이용합니다',
  },
  {
    id: 10,
    question: '활기차고 유동인구가 많은 동네를 선호하나요?',
    subtitle: '사람이 많고 다양한 활동이 가능한 곳을 좋아합니다',
  },
]
