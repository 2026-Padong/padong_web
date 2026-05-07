import { cn } from '@/lib/cn'

// Figma 1:1: Tile · SubwayLineBadge (1087:3413) > SubwayLineBadge COMPONENT_SET
// 숫자 노선 (1~9): size-[16px] 원형, 이름 노선 (경의중앙 등): pill px-[6px] py-px
// Text: Noto Sans KR Bold 10px text-white
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

const NUMBERED: ReadonlySet<SubwayLine> = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9'])

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

const DEFAULT_LABEL: Record<SubwayLine, string> = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  'gyeongui-jungang': '경의중앙',
  gyeongchun: '경춘',
  airport: '공항철도',
  'suin-bundang': '수인분당',
  shinbundang: '신분당',
  'gtx-a': 'GTX-A',
  'uijeongbu-shinseol': '우이신설',
  seohae: '서해',
  'gimpo-gold': '김포골드',
}

export interface SubwayLineBadgeProps {
  line: SubwayLine
  label?: string
}

export function SubwayLineBadge({ line, label }: SubwayLineBadgeProps) {
  const isNumbered = NUMBERED.has(line)
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full text-caption font-bold text-neutral-white whitespace-nowrap',
        isNumbered ? 'size-[16px]' : 'px-[6px] py-px',
        TOKEN[line],
      )}
    >
      {label ?? DEFAULT_LABEL[line]}
    </span>
  )
}
