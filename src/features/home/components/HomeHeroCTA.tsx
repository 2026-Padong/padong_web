import type { ReactNode } from 'react'

export interface HomeHeroCTAProps {
  children: ReactNode
  onClick?: () => void
}

export function HomeHeroCTA({ children, onClick }: HomeHeroCTAProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md bg-brand-primary px-md py-sm text-subhead font-bold text-neutral-white"
    >
      {children}
    </button>
  )
}
