'use client'

import { useState } from 'react'
import type { Product } from '@/lib/products'
import ProductCard from './ProductCard'

export default function CatalogClient({ products }: { products: Product[] }) {
  const cats = ['Todos', ...Array.from(new Set(products.map(p => p.category)))]
  const [active, setActive] = useState('Todos')

  const filtered = active === 'Todos' ? products : products.filter(p => p.category === active)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-rose-800 mb-4">
          Flores que hablan<br />
          <span className="italic text-rose-500">por ti</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Arreglos frescos y hermosos para cada ocasión. Entrega a domicilio en El Salvador.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {cats.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active === cat
                ? 'bg-rose-600 text-white'
                : 'bg-white text-gray-600 hover:bg-rose-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
