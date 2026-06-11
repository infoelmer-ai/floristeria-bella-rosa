'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/lib/cartStore'
import { MinusIcon, PlusIcon, TrashIcon } from '@/components/Icons'

interface DeliveryForm {
  recipientName: string
  recipientPhone: string
  address: string
  references: string
  deliveryDate: string
  deliveryTime: string
  dedication: string
}

const EMPTY_FORM: DeliveryForm = {
  recipientName: '',
  recipientPhone: '',
  address: '',
  references: '',
  deliveryDate: '',
  deliveryTime: '',
  dedication: '',
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<DeliveryForm>(EMPTY_FORM)

  const today = new Date().toISOString().split('T')[0]

  function setField<K extends keyof DeliveryForm>(key: K, value: DeliveryForm[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
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
          delivery: form,
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
    <form onSubmit={handleCheckout} className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold text-rose-800 mb-8">Tu Carrito</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items + Delivery */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
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
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <MinusIcon className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <PlusIcon className="w-3 h-3 text-gray-600" />
                    </button>
                    <button
                      type="button"
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

          {/* Delivery Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-gray-800 mb-1">Datos de entrega</h2>
            <p className="text-xs text-gray-400 mb-5">Para entregar tu pedido en El Salvador</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre del destinatario *</label>
                <input
                  required
                  value={form.recipientName}
                  onChange={e => setField('recipientName', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Ej: María López"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono del destinatario *</label>
                <input
                  required
                  type="tel"
                  value={form.recipientPhone}
                  onChange={e => setField('recipientPhone', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="7777-7777"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fecha de entrega *</label>
                <input
                  required
                  type="date"
                  min={today}
                  value={form.deliveryDate}
                  onChange={e => setField('deliveryDate', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Dirección completa *</label>
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={e => setField('address', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                  placeholder="Colonia, calle, número de casa, municipio, departamento"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Referencias / Indicaciones</label>
                <input
                  value={form.references}
                  onChange={e => setField('references', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Ej: Casa color blanca, portón negro, frente al parque"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hora preferida</label>
                <select
                  value={form.deliveryTime}
                  onChange={e => setField('deliveryTime', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                >
                  <option value="">Cualquier hora</option>
                  <option value="Mañana (8am - 12pm)">Mañana (8am - 12pm)</option>
                  <option value="Tarde (12pm - 5pm)">Tarde (12pm - 5pm)</option>
                  <option value="Noche (5pm - 8pm)">Noche (5pm - 8pm)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Dedicatoria (opcional)</label>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={form.dedication}
                  onChange={e => setField('dedication', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                  placeholder="Mensaje que irá con el arreglo... (máx. 200 caracteres)"
                />
                <p className="text-xs text-gray-300 text-right mt-1">{form.dedication.length}/200</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit md:sticky md:top-4">
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
            type="submit"
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
    </form>
  )
}
