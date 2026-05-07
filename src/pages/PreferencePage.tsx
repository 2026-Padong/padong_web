import { useNavigate, useSearchParams } from 'react-router'
import { useEffect, useState } from 'react'
import { SideNav } from '@/components/layout/SideNav'
import { LifestyleQuestionPanel } from '@/features/neighborhood-finder/components/LifestyleQuestionPanel'
import { PREFERENCE_QUESTIONS } from '@/features/neighborhood-finder/data/preferenceQuestions'

const TOTAL = 10

type Likert = 1 | 2 | 3 | 4 | 5

export function PreferencePage() {
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const q = Number(params.get('q') ?? 1)
  const [answers, setAnswers] = useState<Record<number, Likert>>({})

  useEffect(() => {
    if (q < 1 || q > TOTAL) setParams({ q: '1' })
  }, [q, setParams])

  const setAnswer = (v: Likert) => setAnswers((a) => ({ ...a, [q]: v }))
  const goNext = () =>
    q < TOTAL ? setParams({ q: String(q + 1) }) : nav('/finder/preference/analyzing')

  const current = PREFERENCE_QUESTIONS[Math.max(0, Math.min(TOTAL - 1, q - 1))]

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Custom" />
      <LifestyleQuestionPanel
        title="내 취향 기반"
        current={q}
        total={TOTAL}
        question={current.question}
        questionSubtitle={current.subtitle}
        selected={answers[q]}
        onSelect={(v) => {
          setAnswer(v)
          setTimeout(goNext, 200)
        }}
        currentPage={1}
        totalPages={1}
      />
    </div>
  )
}
