import type { ReactNode } from 'react'

type StickyHeaderProps = {
  children?: ReactNode
  logoSrc?: string
  logoAlt?: string
  logo?: ReactNode
}

export default function SiteHeader({
  children,
  logoSrc,
  logoAlt = 'Logo',
  logo,
}: StickyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0B0C]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center">
          {logo ??
            (logoSrc ? (
              <img src={logoSrc} alt={logoAlt} className="h-12 w-auto object-contain" />
            ) : null)}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
          {children}
        </div>
      </div>
    </header>
  )
}
