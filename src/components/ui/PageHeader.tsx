import { cva } from 'class-variance-authority'
import { Icon } from './Icon'

// Figma 1:1: Tile · PageHeader (841:3094) > PageHeader COMPONENT_SET (Search/Shop)
// flex gap-xs items-center justify-center bg-neutral-white p-0
// Search: rounded-lg + Location(Pin) icon
// Shop: no rounded + Storefront icon
// Title: Noto Sans KR Bold 28px text-text-primary
const headerVariants = cva('flex items-center justify-center gap-xs bg-neutral-white', {
  variants: {
    type: {
      Search: 'rounded-lg',
      Shop: '',
    },
  },
})

export interface PageHeaderProps {
  type: 'Search' | 'Shop'
  title: string
}

export function PageHeader({ type, title }: PageHeaderProps) {
  return (
    <div className={headerVariants({ type })}>
      <Icon name={type === 'Shop' ? 'icon-storefront' : 'icon-location'} size={24} aria-hidden />
      <h1 className="text-h2 font-bold text-text-primary whitespace-nowrap">{title}</h1>
    </div>
  )
}
