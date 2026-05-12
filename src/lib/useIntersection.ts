import { useEffect, useRef } from 'react'

// IntersectionObserver — sentinel 엘리먼트가 viewport 또는 지정 root 에 진입하면 콜백
// root 미지정 시 브라우저 viewport. 컨테이너 내부 스크롤이면 그 컨테이너 ref 전달.
export function useIntersection(
  onIntersect: () => void,
  {
    enabled = true,
    rootMargin = '200px',
    root,
  }: {
    enabled?: boolean
    rootMargin?: string
    root?: Element | null
  } = {},
) {
  const ref = useRef<HTMLDivElement | null>(null)
  const cbRef = useRef(onIntersect)
  cbRef.current = onIntersect

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) cbRef.current()
      },
      { rootMargin, root: root ?? null },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, rootMargin, root])

  return ref
}
