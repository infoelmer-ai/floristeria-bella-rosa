'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useCartStore } from '@/lib/cartStore'

export default function SuccessPage() {
  const clearCart = useCartStore(s => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-3xl shadow-sm p-12">
        <div className="text-6xl mb-6">🌸</div>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-gray-800 mb-3">
          ¡Pago exitoso!
        </h1>
        <p className="text-gray-500 text-lg mb-2">Gracias por tu pedido en Bella Rosa.</p>
        <p className="text-gray-400 text-sm mb-8">
          Recibirás un correo de confirmación. Nos pondremos en contacto para coordinar la entrega.
        </p>
        <Link
          href="/"
          className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full font-medium hover:bg-rose-700 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
