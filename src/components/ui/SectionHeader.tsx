import type { ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { SectionTitle } from './SectionTitle'

const variants = cva('flex items-center', {
  variants: { type: { Title: '', TitleSearch: 'gap-md', More: 'justify-between' } },
})

export interface SectionHeaderProps {
  type: 'Title' | 'TitleSearch' | 'More'
  title: string
  trailing?: ReactNode
}

export function SectionHeader({ type, title, trailing }: SectionHeaderProps) {
  return (
    <div className={variants({ type })}>
      <SectionTitle>{title}</SectionTitle>
      {trailing}
    </div>
  )
}
