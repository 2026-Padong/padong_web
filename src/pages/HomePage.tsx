import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { HomeHero } from '@/features/home/components/HomeHero'

export function HomePage() {
  const nav = useNavigate()
  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav activeType="Commute" />
      <main className="flex w-full justify-center px-4 py-9">
        <div className="grid w-full max-w-[1440px] grid-cols-2 gap-md">
          <section className="flex flex-col gap-12">
            <HomeHero
              onPrimaryCta={() => nav('/finder/job')}
              onSecondaryCta={() => nav('/finder/preference')}
            />
          </section>
          <section className="flex flex-col gap-9 pt-6" />
        </div>
      </main>
    </div>
  )
}
