import { WeatherIcon, type DataIconKind } from '@/components/ui/WeatherIcon'

const KINDS: DataIconKind[] = [
  'sunny',
  'cloud',
  'cloudy',
  'rain',
  'snow',
  'thermometer',
  'dust',
  'umbrella',
]

export function WeatherPreview() {
  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-xl p-xl">
      <h1 className="text-h3 font-bold text-text-primary">Weather Icons</h1>
      <div className="grid grid-cols-4 gap-lg">
        {KINDS.map((k) => (
          <div
            key={k}
            className="flex flex-col items-center gap-sm rounded-md border border-border-default p-md"
          >
            <WeatherIcon kind={k} size={64} />
            <span className="text-body font-bold text-text-primary">{k}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
