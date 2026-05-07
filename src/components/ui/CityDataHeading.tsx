// Figma 1:1: Tile · CityDataHeading (927:3127) > CityDataHeading COMPONENT
// flex flex-col items-center
// Text: Noto Sans KR Bold 22px text-brand-primary
// Figma 기본값 "실시간 도시데이터" — children prop으로 flexible
export interface CityDataHeadingProps {
  /** 표시 텍스트 (기본: "실시간 도시데이터") */
  children?: React.ReactNode
}

export function CityDataHeading({ children = '실시간 도시데이터' }: CityDataHeadingProps) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-h3 font-bold text-brand-primary whitespace-nowrap">{children}</h2>
    </div>
  )
}
