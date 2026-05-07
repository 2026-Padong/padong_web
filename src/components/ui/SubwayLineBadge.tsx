import { cn } from '@/lib/cn'

export type SubwayLine =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'gyeongui-jungang'
  | 'gyeongchun'
  | 'airport'
  | 'suin-bundang'
  | 'shinbundang'
  | 'gtx-a'
  | 'uijeongbu-shinseol'
  | 'seohae'
  | 'gimpo-gold'

const TOKEN: Record<SubwayLine, string> = {
  '1': 'bg-transit-line-1',
  '2': 'bg-transit-line-2',
  '3': 'bg-transit-line-3',
  '4': 'bg-transit-line-4',
  '5': 'bg-transit-line-5',
  '6': 'bg-transit-line-6',
  '7': 'bg-transit-line-7',
  '8': 'bg-transit-line-8',
  '9': 'bg-transit-line-9',
  'gyeongui-jungang': 'bg-transit-gyeongui-jungang',
  gyeongchun: 'bg-transit-gyeongchun',
  airport: 'bg-transit-airport',
  'suin-bundang': 'bg-transit-suin-bundang',
  shinbundang: 'bg-transit-shinbundang',
  'gtx-a': 'bg-transit-gtx-a',
  'uijeongbu-shinseol': 'bg-transit-uijeongbu-shinseol',
  seohae: 'bg-transit-seohae',
  'gimpo-gold': 'bg-transit-gimpo-gold',
}

export interface SubwayLineBadgeProps {
  line: SubwayLine
  /** 표시할 라벨 (없으면 라인 번호) */
  label?: string
}

export function SubwayLineBadge({ line, label }: SubwayLineBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-body-s font-bold text-neutral-white',
        TOKEN[line],
      )}
    >
      {label ?? line.toUpperCase()}
    </span>
  )
}
