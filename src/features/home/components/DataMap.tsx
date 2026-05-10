import DistrictJongno from '@/assets/icons/data-map/district-jongno.svg?react'
import DistrictJunggu from '@/assets/icons/data-map/district-junggu.svg?react'
import DistrictYongsan from '@/assets/icons/data-map/district-yongsan.svg?react'
import DistrictSeongdong from '@/assets/icons/data-map/district-seongdong.svg?react'
import DistrictGwangjin from '@/assets/icons/data-map/district-gwangjin.svg?react'
import DistrictDongdaemun from '@/assets/icons/data-map/district-dongdaemun.svg?react'
import DistrictJungnang from '@/assets/icons/data-map/district-jungnang.svg?react'
import DistrictSeongbuk from '@/assets/icons/data-map/district-seongbuk.svg?react'
import DistrictGangbuk from '@/assets/icons/data-map/district-gangbuk.svg?react'
import DistrictDobong from '@/assets/icons/data-map/district-dobong.svg?react'
import DistrictNowon from '@/assets/icons/data-map/district-nowon.svg?react'
import DistrictEunpyeong from '@/assets/icons/data-map/district-eunpyeong.svg?react'
import DistrictSeodaemun from '@/assets/icons/data-map/district-seodaemun.svg?react'
import DistrictMapo from '@/assets/icons/data-map/district-mapo.svg?react'
import DistrictYangcheon from '@/assets/icons/data-map/district-yangcheon.svg?react'
import DistrictGangseo from '@/assets/icons/data-map/district-gangseo.svg?react'
import DistrictGuro from '@/assets/icons/data-map/district-guro.svg?react'
import DistrictGeumcheon from '@/assets/icons/data-map/district-geumcheon.svg?react'
import DistrictYeongdeungpo from '@/assets/icons/data-map/district-yeongdeungpo.svg?react'
import DistrictDongjak from '@/assets/icons/data-map/district-dongjak.svg?react'
import DistrictGwanak from '@/assets/icons/data-map/district-gwanak.svg?react'
import DistrictSeocho from '@/assets/icons/data-map/district-seocho.svg?react'
import DistrictGangnam from '@/assets/icons/data-map/district-gangnam.svg?react'
import DistrictSongpa from '@/assets/icons/data-map/district-songpa.svg?react'
import DistrictGangdong from '@/assets/icons/data-map/district-gangdong.svg?react'

// Figma 1:1: Tile · DataMap (950:3179) > DataMap COMPONENT
// 600×493 — 25개 서울 구의 정적 SVG illustration map
// Phase 9.6 fluid: aspect-ratio 600/493 유지, 좌표는 percentage로 변환
// 이전 Leaflet 인터랙티브 → Figma 1:1 정적 일러스트로 정책 개정
// Figma의 용산구 brand-primary 라벨은 hover 상태 시연 — 우리 구현은 모든 구가 동일 default + hover 시 brand-primary로 변경
type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>

// 각 구의 Figma 600×493 frame 내 좌표·크기 (px) — 모두 percentage로 변환되어 fluid 적용
interface DistrictSpec {
  name: string
  Component: SvgComponent
  /** Figma frame (600×493) 기준 좌표·크기 (px) */
  left: number
  top: number
  width: number
  height: number
  /** 라벨 위치 (구 박스 내부 기준 px) */
  labelLeft: number
  labelTop: number
}

const W = 600
const H = 493

const DISTRICTS: DistrictSpec[] = [
  { name: '종로구', Component: DistrictJongno, left: 264, top: 125, width: 106, height: 120, labelLeft: 44.5, labelTop: 86.13 },
  { name: '중구', Component: DistrictJunggu, left: 282, top: 234, width: 93, height: 51, labelLeft: 53.5, labelTop: 21.13 },
  { name: '성동구', Component: DistrictSeongdong, left: 349, top: 232, width: 94, height: 81, labelLeft: 47.5, labelTop: 40.5 },
  { name: '광진구', Component: DistrictGwangjin, left: 418, top: 230, width: 84, height: 92, labelLeft: 47.8, labelTop: 45.2 },
  { name: '동대문구', Component: DistrictDongdaemun, left: 371, top: 167, width: 79, height: 89, labelLeft: 40.9, labelTop: 45.5 },
  { name: '중랑구', Component: DistrictJungnang, left: 437, top: 146, width: 70, height: 92, labelLeft: 34, labelTop: 45.8 },
  { name: '성북구', Component: DistrictSeongbuk, left: 301, top: 117, width: 139, height: 106, labelLeft: 62.5, labelTop: 65.38 },
  { name: '강북구', Component: DistrictGangbuk, left: 308, top: 30, width: 100, height: 137, labelLeft: 34.5, labelTop: 80.13 },
  { name: '도봉구', Component: DistrictDobong, left: 348, top: 0, width: 69, height: 128, labelLeft: 36.4, labelTop: 64.9 },
  { name: '노원구', Component: DistrictNowon, left: 397, top: 10, width: 101, height: 148, labelLeft: 45.9, labelTop: 76.2 },
  { name: '은평구', Component: DistrictEunpyeong, left: 168, top: 76, width: 116, height: 150, labelLeft: 63.7, labelTop: 75.9 },
  { name: '서대문구', Component: DistrictSeodaemun, left: 197, top: 164, width: 97, height: 100, labelLeft: 44.5, labelTop: 64.13 },
  { name: '마포구', Component: DistrictMapo, left: 128, top: 200, width: 158, height: 103, labelLeft: 63.4, labelTop: 51.9 },
  { name: '양천구', Component: DistrictYangcheon, left: 82, top: 271, width: 99, height: 87, labelLeft: 49.5, labelTop: 57.13 },
  { name: '강서구', Component: DistrictGangseo, left: 0, top: 174, width: 166, height: 142, labelLeft: 77.6, labelTop: 71 },
  { name: '구로구', Component: DistrictGuro, left: 69, top: 331, width: 129, height: 81, labelLeft: 49.5, labelTop: 40.38 },
  { name: '금천구', Component: DistrictGeumcheon, left: 154, top: 388, width: 81, height: 95, labelLeft: 40.5, labelTop: 47.13 },
  { name: '영등포구', Component: DistrictYeongdeungpo, left: 163, top: 262, width: 103, height: 129, labelLeft: 52.1, labelTop: 60.4 },
  { name: '동작구', Component: DistrictDongjak, left: 199, top: 332, width: 118, height: 76, labelLeft: 65.5, labelTop: 25.13 },
  { name: '관악구', Component: DistrictGwanak, left: 193, top: 372, width: 128, height: 107, labelLeft: 69.5, labelTop: 49.38 },
  { name: '서초구', Component: DistrictSeocho, left: 308, top: 317, width: 166, height: 176, labelLeft: 45.5, labelTop: 68.13 },
  { name: '강남구', Component: DistrictGangnam, left: 349, top: 299, width: 166, height: 144, labelLeft: 62.5, labelTop: 58.13 },
  { name: '송파구', Component: DistrictSongpa, left: 434, top: 286, width: 135, height: 138, labelLeft: 58.5, labelTop: 53.13 },
  { name: '강동구', Component: DistrictGangdong, left: 494, top: 217, width: 106, height: 116, labelLeft: 46.5, labelTop: 57.13 },
  { name: '용산구', Component: DistrictYongsan, left: 258, top: 263, width: 104, height: 89, labelLeft: 51.4, labelTop: 45.6 },
]

export interface DataMapProps {
  /** 선택된 구 (활성 표시 — brand-primary 채움 + 라벨 색) */
  selectedDistrict?: string
  /** 구 클릭 콜백 */
  onDistrictClick?: (name: string) => void
  className?: string
}

const pct = (v: number, base: number) => `${(v / base) * 100}%`

export function DataMap({ selectedDistrict, onDistrictClick, className }: DataMapProps) {
  return (
    <div
      className={`relative w-full overflow-clip rounded-xl bg-neutral-white ${className ?? ''}`}
      style={{ aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label="서울특별시 25개 구 지도"
    >
      {DISTRICTS.map((d) => {
        const Shape = d.Component
        const isSelected = d.name === selectedDistrict
        return (
          <div
            key={d.name}
            className={`group pointer-events-none absolute ${
              isSelected
                ? 'z-10 [--fill-0:var(--color-brand-primary-tint)] [--stroke-0:var(--color-brand-primary)]'
                : 'z-0 [--fill-0:var(--color-surface-cool)] [--stroke-0:var(--color-neutral-white)] hover:z-10 hover:[--fill-0:var(--color-brand-primary-tint)] hover:[--stroke-0:var(--color-brand-primary)]'
            }`}
            style={{
              left: pct(d.left, W),
              top: pct(d.top, H),
              width: pct(d.width, W),
              height: pct(d.height, H),
            }}
          >
            {/* SVG path 모양만 click 영역 — svg element는 pointer-events:none, 내부 path만 visiblePainted로 정확한 path 모양 클릭 */}
            <Shape
              className={`absolute -inset-px size-[calc(100%+2px)] overflow-visible [pointer-events:none] [&_path]:[pointer-events:visiblePainted] ${onDistrictClick ? '[&_path]:cursor-pointer' : ''}`}
              role={onDistrictClick ? 'button' : undefined}
              aria-label={onDistrictClick ? d.name : undefined}
              aria-pressed={onDistrictClick ? isSelected : undefined}
              onClick={onDistrictClick ? () => onDistrictClick(d.name) : undefined}
            />
            {/* 라벨 — selected/hover 시 brand-primary, pointer-events 무시 */}
            <span
              className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[11px] font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)] ${
                isSelected ? 'text-brand-primary' : 'text-text-tertiary group-hover:text-brand-primary'
              }`}
              style={{
                left: pct(d.labelLeft, d.width),
                top: pct(d.labelTop, d.height),
              }}
            >
              {d.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
