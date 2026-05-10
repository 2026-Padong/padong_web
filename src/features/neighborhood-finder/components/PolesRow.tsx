import { DesktopPole, type DesktopPoleProps } from './DesktopPole'

// Figma 1:1: Tile · PolesRow (1490:4161) > PolesRow COMPONENT
// w-full + md:flex-row gap-3xl items-center (Phase 9.6 fluid)
// 2개 DesktopPole (Left + Right)
export interface PolesRowProps {
  left: Omit<DesktopPoleProps, 'side'>
  right: Omit<DesktopPoleProps, 'side'>
}

export function PolesRow({ left, right }: PolesRowProps) {
  return (
    <div className="flex w-full flex-col items-stretch gap-md whitespace-nowrap md:flex-row md:items-center md:gap-3xl">
      <DesktopPole side="left" {...left} />
      <DesktopPole side="right" {...right} />
    </div>
  )
}
