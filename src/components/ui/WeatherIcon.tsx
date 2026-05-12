import IconSunny from '@/assets/weather/sunny.svg?react'
import IconCloud from '@/assets/weather/cloud.svg?react'
import IconCloudy from '@/assets/weather/cloudy.svg?react'
import IconRain from '@/assets/weather/rain.svg?react'
import IconSnow from '@/assets/weather/snow.svg?react'
import IconThermometer from '@/assets/weather/thermometer.svg?react'
import IconDust from '@/assets/weather/dust.svg?react'
import IconUmbrella from '@/assets/weather/umbrella.svg?react'

// Figma: Design System > Components v2 > Data Icons
// 8개 모두 64×64 자체 배경 + 라운드 + outline 아이콘 통일 스타일
export type WeatherKind = 'sunny' | 'cloud' | 'cloudy' | 'rain' | 'snow'
export type DataIconKind = WeatherKind | 'thermometer' | 'dust' | 'umbrella'

const ICON: Record<DataIconKind, React.FC<React.SVGProps<SVGSVGElement>>> = {
  sunny: IconSunny,
  cloud: IconCloud,
  cloudy: IconCloudy,
  rain: IconRain,
  snow: IconSnow,
  thermometer: IconThermometer,
  dust: IconDust,
  umbrella: IconUmbrella,
}

// 한글 weatherStatus → WeatherKind 매핑 (서울 열린데이터 PRECPT_TYPE + SKY_STTS)
// 가능값: 맑음 / 구름많음 / 흐림 / 비 / 소나기 / 빗방울 / 비/눈 / 빗방울/눈날림 / 눈 / 눈날림
export function kindFromStatus(status: string | undefined): WeatherKind {
  if (!status) return 'sunny'
  const s = status.trim()
  if (s.includes('비')) return 'rain'
  if (s.includes('눈')) return 'snow'
  if (s.includes('흐')) return 'cloud'
  if (s.includes('구름')) return 'cloudy'
  return 'sunny'
}

export interface WeatherIconProps {
  status?: string
  kind?: DataIconKind
  size?: number
  className?: string
}

export function WeatherIcon({ status, kind, size = 48, className }: WeatherIconProps) {
  const resolved: DataIconKind = kind ?? kindFromStatus(status)
  const Cmp = ICON[resolved]
  return <Cmp width={size} height={size} className={className} aria-hidden />
}
