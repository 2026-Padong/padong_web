export interface TitleBlockProps {
  title: string
  subtitle?: string
}

export function TitleBlock({ title, subtitle }: TitleBlockProps) {
  return (
    <div className="flex flex-col items-center gap-md text-center">
      <h2 className="text-h2 font-bold text-text-primary">{title}</h2>
      {subtitle && <p className="text-body-l text-text-secondary">{subtitle}</p>}
    </div>
  )
}
