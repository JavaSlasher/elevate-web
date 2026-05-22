import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'

type GoldButtonProps = {
  children: ReactNode
}

export default function GoldButton({ children }: GoldButtonProps) {
  return (
    <Button
      className="
        rounded-xl
        border border-yellow-500/70
        bg-gradient-to-b from-[#f7d774] via-[#d4a637] to-[#8a6218]
        px-8 py-5
        text-lg
        font-semibold text-black
        shadow-lg shadow-yellow-700/30
        transition
        hover:from-[#ffe89a] hover:via-[#e0b94a] hover:to-[#9a6f1c]
        active:scale-[0.98]
      "
    >
      {children}
    </Button>
  )
}
