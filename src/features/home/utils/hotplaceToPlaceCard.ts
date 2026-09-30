import type { HotplaceRealtimeItem } from '@/api/realtime'
import type { PlaceCardProps } from '@/features/home/components/PlaceCard'
import type { CategoryType } from '@/components/ui/CategoryBadge'

// 백엔드 hotplace 라벨이 PlaceCard CategoryType 과 1:1 매핑 (서울시 5종)
// 매칭 안 되면 첫번째 fallback
function normalizeCategory(c: string | undefined): CategoryType {
  const allowed: CategoryType[] = ['관광특구', '고궁·문화유산', '인구밀집지역', '발달상권', '공원']
  return (allowed.includes(c as CategoryType) ? c : '관광특구') as CategoryType
}

function congestionTone(level: string | undefined): 'positive' | 'neutral' {
  if (!level) return 'neutral'
  if (level.includes('여유') || level.includes('원활')) return 'positive'
  return 'neutral'
}

// HotplaceRealtimeItem → PlaceCardProps
export function hotplaceToPlaceCard(h: HotplaceRealtimeItem): PlaceCardProps {
  const event = h.eventNm && h.eventNm !== '정보 없음' ? h.eventNm : undefined
  const subwayName = (h.transport as { subway?: { stationName?: string } } | undefined)?.subway
    ?.stationName
  const busCount = (h.transport as { bus?: { count?: number } } | undefined)?.bus?.count
  const bikeCount = (h.transport as { bike?: { count?: number } } | undefined)?.bike?.count

  const populationDisplay = h.population?.display ?? '-'
  const populationHint = h.population?.congestionLevel ?? undefined
  const ageDominant = h.age?.dominantGroup ?? '-'
  const ageRate = h.age?.dominantRate ?? ''
  const maleRate = h.gender?.maleRate ?? '-'
  const femaleRate = h.gender?.femaleRate ?? '-'
  const roadStatus = h.roadTraffic?.status ?? '-'
  const roadSpeed = h.roadTraffic?.speed ?? ''

  return {
    image: h.thumbnail || undefined,
    category: normalizeCategory(h.category),
    event,
    name: h.areaNm,
    address: h.roadAddr,
    facilities: {
      subway: subwayName ? { station: subwayName, lines: [] } : undefined,
      busStops: busCount,
      bikeStations: bikeCount,
    },
    data: [
      {
        icon: 'population',
        label: '인구',
        value: populationDisplay,
        hint: populationHint,
        hintTone: congestionTone(populationHint),
      },
      {
        icon: 'age',
        label: '주연령',
        value: ageDominant,
        hint: ageRate,
      },
      {
        icon: 'composition',
        label: '성비',
        value: `남 ${maleRate}`,
        hint: `여 ${femaleRate}`,
      },
      {
        icon: 'road',
        label: '도로',
        value: roadStatus,
        hint: roadSpeed,
        hintTone: congestionTone(roadStatus),
      },
    ],
  }
}
