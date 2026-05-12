// 텍스트 안에서 일치 부분을 brand-primary bold 로 강조
// 자동완성 dropdown 등에서 사용자가 입력한 부분 시각 강조용
export interface HighlightProps {
  text: string
  match: string
}

export function Highlight({ text, match }: HighlightProps) {
  if (!match) return <>{text}</>
  const idx = text.indexOf(match)
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-bold text-brand-primary">{text.slice(idx, idx + match.length)}</span>
      {text.slice(idx + match.length)}
    </>
  )
}
