import { DesktopPole, type DesktopPoleProps } from './DesktopPole'

// Figma 1:1: Tile · PolesRow (1490:4161) > PolesRow COMPONENT
// w-[1112px] flex gap-3xl items-center
// 2개 DesktopPole (Left + Right)
export interface PolesRowProps {
  left: Omit<DesktopPoleProps, 'side'>
  right: Omit<DesktopPoleProps, 'side'>
}

export function PolesRow({ left, right }: PolesRowProps) {
  return (
    <div className="flex w-full items-center gap-3xl whitespace-nowrap">
      <DesktopPole side="left" {...left} />
      <DesktopPole side="right" {...right} />
    </div>
  )
}
