'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/cartStore'
import { ShoppingCartIcon } from './Icons'

export default function Navbar() {
  const itemCount = useCartStore(s => s.itemCount())
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🌸</span>
          <div>
            <p className="font-serif text-xl font-semibold text-rose-800 leading-tight">Bella Rosa</p>
            <p className="text-xs text-rose-400 tracking-widest uppercase">Floristería</p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-rose-600 transition-colors hidden sm:block">
            Catálogo
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700 transition-colors">
            <ShoppingCartIcon className="w-4 h-4" />
            <span>Carrito</span>
            {mounted && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
