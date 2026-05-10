import { ScoreBadgeLarge } from '@/components/ui/ScoreBadgeLarge'
import { DetailAddress, type DetailAddressProps } from './DetailAddress'

// Figma 1:1: Tile · DetailHeader (431:856) > ShopScoreHeader COMPONENT
// flex gap-sm items-center w-[332px]
// ScoreBadgeLarge (size-[56px]) + DetailAddress
export interface DetailHeaderProps extends DetailAddressProps {
  score: number
}

export function DetailHeader({ score, dong, fullAddress }: DetailHeaderProps) {
  return (
    <div className="flex w-full items-center gap-sm overflow-clip">
      <ScoreBadgeLarge value={score} />
      <DetailAddress dong={dong} fullAddress={fullAddress} />
    </div>
  )
}
