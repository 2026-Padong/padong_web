import analyzingImg from '@/assets/analyzing-illustration.png'

// Figma 1:1: Tile · AnalyzingIllustration (1527:4244) > AnalyzingIllustration (master)
// 380×265 overflow-clip
// 내부: 분석중_IMG (380×265 absolute) > 이미지가 247.94% × 259.46% 크기로 left:-91.22% top:-49.64% offset
// (원본 PNG가 와이드 일러스트라 380×265 영역만 cropping해서 보여줌)
export function AnalyzingIllustration() {
  return (
    <div className="relative h-[265px] w-[380px] overflow-clip">
      <div className="absolute h-[265px] left-0 top-0 w-[380px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src={analyzingImg}
            alt=""
            className="absolute h-[247.94%] left-[-91.22%] top-[-49.64%] w-[259.46%] max-w-none"
          />
        </div>
      </div>
    </div>
  )
}
