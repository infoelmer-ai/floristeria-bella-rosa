'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cartStore'
import type { Product } from '@/lib/products'
import { ShoppingCartIcon, CheckIcon } from './Icons'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-white/90 text-rose-700 text-xs font-medium px-2 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-gray-800 leading-tight">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-rose-700">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95'
            }`}
          >
            {added ? (
              <><CheckIcon className="w-4 h-4" /> Añadido</>
            ) : (
              <><ShoppingCartIcon className="w-4 h-4" /> Añadir</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
