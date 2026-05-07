export interface CityDataHeadingProps {
  city: string
}

export function CityDataHeading({ city }: CityDataHeadingProps) {
  return <h2 className="text-h2 font-bold text-text-primary">{city}</h2>
}
