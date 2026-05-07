import type { ReactNode } from 'react'

export interface HomeHeroTagProps {
  children: ReactNode
}

export function HomeHeroTag({ children }: HomeHeroTagProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-primary-tint px-md py-xs text-body-l font-bold text-brand-primary">
      {children}
    </span>
  )
}
