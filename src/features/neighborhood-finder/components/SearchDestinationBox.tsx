import { useState } from 'react'
import { DestinationBar, type DestinationBarProps } from './DestinationBar'
import { useDongSuggestions } from '@/api/queries/useDongSuggestions'

// Figma 1:1: Tile · SearchDestinationBox (431:889) > SearchDestinationBox COMPONENT
// DestinationBar + 자동완성 드롭다운 + hint
export interface SearchDestinationBoxProps extends DestinationBarProps {
  /** 우측 정렬 hint, 예: "연희동" */
  hint?: string
  /** Enter 또는 자동완성 선택 → 입력 확정 콜백 (다중 모드에서 칩 추가) */
  onSubmit?: (v: string) => void
}

export function SearchDestinationBox({
  hint,
  value,
  onChange,
  onSubmit,
  ...barProps
}: SearchDestinationBoxProps) {
  const [focused, setFocused] = useState(false)
  const query = value ?? ''
  const { data } = useDongSuggestions(query)
  const suggestions = data?.items ?? []
  const showSuggestions = focused && query.trim().length > 0 && suggestions.length > 0

  const submit = (v: string) => {
    if (onSubmit) onSubmit(v)
    else onChange?.(v)
    // setFocused(false) 안 함 — input 포커스 유지되어 다음 타이핑 시 dropdown 다시 뜨도록
    // submit이 input을 비우면 query.length===0이 되어 dropdown 자연스럽게 사라짐
  }

  return (
    <div className="relative flex w-full flex-col items-start gap-xs">
      <div
        className="w-full"
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        onKeyDown={(e) => {
          // Enter는 자동완성 매칭이 있을 때만 첫 항목 추가 — 임의 입력값은 추가 X
          if (e.key === 'Enter' && suggestions.length > 0) {
            e.preventDefault()
            submit(suggestions[0])
          }
        }}
      >
        <DestinationBar {...barProps} value={value} onChange={onChange} />
      </div>
      {showSuggestions && (
        <ul
          role="listbox"
          aria-label="행정동 자동완성"
          className="absolute left-0 right-0 top-full z-10 mt-xs flex w-full flex-col items-stretch overflow-clip rounded-md border border-border-default bg-neutral-white shadow-md"
        >
          {suggestions.map((name) => (
            <li key={name}>
              <button
                type="button"
                role="option"
                aria-selected={name === query}
                onMouseDown={(e) => {
                  e.preventDefault()
                  submit(name)
                }}
                className="flex w-full cursor-pointer items-center px-md py-sm text-left text-body font-normal text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary"
              >
                <Highlight text={name} match={query.trim()} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {hint && !showSuggestions && (
        <p className="w-full text-right text-body-l font-normal text-text-secondary">{hint}</p>
      )}
    </div>
  )
}

function Highlight({ text, match }: { text: string; match: string }) {
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
