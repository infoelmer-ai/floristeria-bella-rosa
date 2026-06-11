'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/lib/cartStore'
import { MinusIcon, PlusIcon, TrashIcon } from '@/components/Icons'

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al procesar el pago')
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-serif text-2xl text-gray-700 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-6">Agrega flores hermosas para comenzar tu pedido</p>
        <Link href="/" className="inline-block bg-rose-600 text-white px-6 py-3 rounded-full font-medium hover:bg-rose-700 transition-colors">
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold text-rose-800 mb-8">Tu Carrito</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 text-sm leading-tight">{product.name}</h3>
                <p className="text-rose-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <MinusIcon className="w-3 h-3 text-gray-600" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <PlusIcon className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-4">Resumen</h2>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-sm text-gray-500 mb-2">
              <span className="truncate mr-2">{product.name} x{quantity}</span>
              <span className="flex-shrink-0">${(product.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-semibold text-gray-800 text-lg">
            <span>Total</span>
            <span className="text-rose-700">${total().toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">USD · incluye impuestos</p>

          {error && (
            <p className="text-red-500 text-sm mt-3 bg-red-50 rounded-lg p-2">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mt-6 bg-rose-600 text-white py-3 rounded-full font-semibold hover:bg-rose-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Procesando...</>
            ) : (
              '💳 Pagar con tarjeta'
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <span className="text-xs text-gray-400">Pago seguro con Stripe</span>
          </div>
        </div>
      </div>
    </div>
  )
}
