'use client'

import { Heart, User, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold gradient-text">
          데이트 메이트
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/search"
            className={`p-2 rounded-lg transition-colors ${
              isActive('/search') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
            }`}
          >
            <Search className="w-5 h-5" />
          </Link>
          <Link
            href="/mypage"
            className={`p-2 rounded-lg transition-colors ${
              isActive('/mypage') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
