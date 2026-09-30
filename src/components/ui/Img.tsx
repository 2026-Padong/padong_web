import { useEffect, useState, type ImgHTMLAttributes, type ReactNode } from 'react'

// src 없음 또는 로드 실패(onError) 시 fallback (또는 null) 로 자동 대체.
// 일반 <img> 와 동일 props — onError 만 내부 처리.
interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  /** 표시할 대체 노드. 미지정이면 아무것도 안 그림 (부모 bg/placeholder 노출) */
  fallback?: ReactNode
}

export function Img({ src, fallback = null, alt = '', ...rest }: ImgProps) {
  const [broken, setBroken] = useState(false)
  // src 가 바뀌면 broken 상태 리셋 (이전 실패 URL 의 잔재 방지)
  useEffect(() => {
    setBroken(false)
  }, [src])
  if (!src || broken) return <>{fallback}</>
  return <img src={src} alt={alt} onError={() => setBroken(true)} {...rest} />
}
