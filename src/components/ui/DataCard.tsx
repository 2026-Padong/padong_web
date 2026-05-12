import { cn } from '@/lib/cn'
import { WeatherIcon, type DataIconKind, type WeatherKind } from './WeatherIcon'

// Figma 1:1: Tile · DataCard (925:3151) > DataCard COMPONENT_SET (4 variants)
// 모든 아이콘 (Weather 5 + Temp/Dust/Rain) 자체 배경 SVG 타일 → wrap 불필요
// 카드: w-[180px] h-[96px] rounded-lg border + 아이콘 48×48 + 콘텐츠
const DEFAULT_KIND: Record<DataCardProps['type'], DataIconKind> = {
  Weather: 'sunny',
  Temp: 'thermometer',
  Dust: 'dust',
  Rain: 'umbrella',
}

export interface DataCardProps {
  type: 'Weather' | 'Temp' | 'Dust' | 'Rain'
  label: string
  value: string
  /** 작은 보조 텍스트 */
  sub?: string
  /** Weather 타입 한정 — 백엔드 status 기반 동적 아이콘 (sunny/cloud/cloudy/rain/snow). 미지정 시 sunny */
  weatherKind?: WeatherKind
  className?: string
}

export function DataCard({ type, label, value, sub, weatherKind, className }: DataCardProps) {
  const kind: DataIconKind = type === 'Weather' ? (weatherKind ?? 'sunny') : DEFAULT_KIND[type]
  return (
    <div
      className={cn(
        'flex h-[96px] w-full min-w-0 items-center gap-md rounded-lg border border-border-default bg-neutral-white p-md',
        className,
      )}
    >
      <WeatherIcon kind={kind} size={48} className="shrink-0" />
      <div className="flex flex-col gap-xxs overflow-clip whitespace-nowrap">
        <span className="text-body-s font-medium text-text-tertiary">{label}</span>
        <span className="text-h4 font-bold text-brand-primary">{value}</span>
        {sub && <span className="text-[12px] font-normal text-text-secondary">{sub}</span>}
      </div>
    </div>
  )
}
