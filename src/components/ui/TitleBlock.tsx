import type { ReactNode } from 'react'

// Figma 1:1: Tile · TitleBlock (1527:4240) > TitleBlock COMPONENT
// flex flex-col gap-md items-center text-center
// Title: 28px Bold text-text-primary (highlight 부분만 brand-primary)
// Body: 16px Regular text-text-secondary
export interface TitleBlockProps {
  /** 제목 — children prop으로 mixed color 표현 가능 */
  title: ReactNode
  /** 본문 (여러 줄 지원) */
  body?: ReactNode
}

export function TitleBlock({ title, body }: TitleBlockProps) {
  return (
    <div className="flex flex-col items-center gap-md text-center">
      <h2 className="text-h2 font-bold text-text-primary">{title}</h2>
      {body && <div className="text-subhead font-normal text-text-secondary">{body}</div>}
    </div>
  )
}
