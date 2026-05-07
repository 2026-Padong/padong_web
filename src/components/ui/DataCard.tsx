import type { ReactNode } from 'react'
import { cva } from 'class-variance-authority'

const variants = cva('flex items-center gap-xl rounded-md p-md', {
  variants: {
    type: {
      Weather: 'bg-[#eff4ff]',
      Temp: 'bg-[#fff2dd]',
      Dust: 'bg-[#fdeded]',
      Rain: 'bg-[#d9ecff]',
    },
  },
})

export interface DataCardProps {
  type: 'Weather' | 'Temp' | 'Dust' | 'Rain'
  title: string
  value: string
  icon?: ReactNode
}

export function DataCard({ type, title, value, icon }: DataCardProps) {
  return (
    <div className={variants({ type })}>
      {icon && <div>{icon}</div>}
      <div className="flex flex-col">
        <span className="text-body-s text-text-tertiary">{title}</span>
        <span className="text-h2 font-bold text-text-primary">{value}</span>
      </div>
    </div>
  )
}
