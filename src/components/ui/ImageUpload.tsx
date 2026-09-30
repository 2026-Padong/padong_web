import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

// 파일 선택 컴포넌트 — File 객체를 부모에 전달 (즉시 업로드 X)
// 실 업로드는 부모(SignupPage 등)가 multipart 제출 시 함께 묶어서 처리
export interface ImageUploadProps {
  label: string
  value?: File | null
  onChange: (file: File | null) => void
  allowedMimes?: string[]
  maxSize?: number
  invalid?: boolean
  hint?: string
}

const FIVE_MB = 5 * 1024 * 1024
const DEFAULT_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg/jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
}
const isPdf = (mime: string) => mime === 'application/pdf'

// 실제 이미지 디코딩 가능 여부 검증 (확장자/MIME 위조 방어, PDF 제외)
function verifyImageDecodes(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(true)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(false)
    }
    img.src = url
  })
}

export function ImageUpload({
  label,
  value,
  onChange,
  allowedMimes = DEFAULT_MIMES,
  maxSize = FIVE_MB,
  invalid,
  hint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // 미리보기 URL 생성/해제
  useEffect(() => {
    if (!value || isPdf(value.type)) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(value)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  const handlePick = () => inputRef.current?.click()

  const handleFile = async (file: File) => {
    setErrorMsg(null)

    if (!allowedMimes.includes(file.type)) {
      const exts = allowedMimes.map((m) => MIME_TO_EXT[m] ?? m).join(', ')
      setErrorMsg(`${exts} 형식만 업로드 가능해요`)
      return
    }
    if (file.size > maxSize) {
      setErrorMsg(`${Math.round(maxSize / 1024 / 1024)}MB 이하 파일만 가능해요`)
      return
    }
    if (!isPdf(file.type)) {
      const ok = await verifyImageDecodes(file)
      if (!ok) {
        setErrorMsg('이미지 파일이 손상됐거나 지원하지 않는 형식이에요')
        return
      }
    }
    onChange(file)
  }

  const handleClear = () => {
    onChange(null)
    setErrorMsg(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex w-full flex-col gap-xs">
      <span className="text-body font-normal text-text-secondary">{label}</span>

      <input
        ref={inputRef}
        type="file"
        accept={allowedMimes.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />

      {value ? (
        <div
          className={cn(
            'flex items-center gap-md rounded-md border bg-neutral-white p-sm',
            invalid ? 'border-status-critical' : 'border-border-default',
          )}
        >
          {isPdf(value.type) ? (
            <div className="inline-flex size-[72px] shrink-0 items-center justify-center rounded-md bg-brand-primary-tint font-bold text-brand-primary ring-1 ring-border-default">
              PDF
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="size-[72px] shrink-0 rounded-md object-cover ring-1 ring-border-default"
            />
          ) : null}
          <div className="flex flex-1 flex-col gap-xxs">
            <span className="text-body-l font-bold text-text-primary truncate">
              {value.name}
            </span>
            <span className="text-body font-normal text-text-tertiary">
              {(value.size / 1024).toFixed(0)} KB
            </span>
            <div className="mt-xs flex items-center gap-xs">
              <button
                type="button"
                onClick={handlePick}
                className="cursor-pointer text-body font-bold text-brand-primary hover:underline"
              >
                변경
              </button>
              <span className="text-text-tertiary">·</span>
              <button
                type="button"
                onClick={handleClear}
                className="cursor-pointer text-body font-normal text-text-tertiary hover:text-status-critical"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePick}
          className={cn(
            'flex w-full cursor-pointer flex-col items-center justify-center gap-xs rounded-md border-2 border-dashed bg-surface-subtle/40 px-md py-xl text-body-l font-normal transition-colors hover:bg-surface-subtle',
            invalid
              ? 'border-status-critical text-status-critical'
              : 'border-border-default text-text-tertiary',
          )}
        >
          <span>파일 업로드</span>
        </button>
      )}

      {(errorMsg || hint) && (
        <span
          className={cn(
            'text-body font-normal',
            errorMsg || invalid ? 'text-status-critical' : 'text-text-tertiary',
          )}
        >
          {errorMsg ?? hint}
        </span>
      )}
    </div>
  )
}
