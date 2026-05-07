import { cva } from 'class-variance-authority'

const headerVariants = cva('inline-flex items-center gap-xs bg-neutral-white', {
  variants: { type: { Search: 'rounded-lg', Shop: '' } },
})

export interface PageHeaderProps {
  type: 'Search' | 'Shop'
  title: string
}

export function PageHeader({ type, title }: PageHeaderProps) {
  return (
    <header className={headerVariants({ type })}>
      <span className="text-h4 font-bold text-text-primary">{title}</span>
    </header>
  )
}
