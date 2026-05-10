import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Padong 커스텀 typography 토큰을 font-size 그룹으로 등록.
// default twMerge는 `text-body-s` 같은 이름을 색상으로 오인해 `text-neutral-white`와
// 충돌 처리하고 제거함 → custom text-* 토큰 전부에 영향. 명시적으로 font-size로 인식시켜야 함.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'hero',
            'display',
            'h1',
            'h2',
            'h3',
            'h4',
            'subhead',
            'body-l',
            'body',
            'caption-lg',
            'body-s',
            'metadata',
            'caption',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
