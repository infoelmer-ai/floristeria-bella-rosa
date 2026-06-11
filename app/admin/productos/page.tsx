'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Product } from '@/lib/products'
import { categories } from '@/lib/products'
import { TrashIcon } from '@/components/Icons'

const EMPTY: Omit<Product, 'id'> = { name: '', description: '', price: 0, image: '', category: 'Rosas' }

export default function AdminProductos() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const t = sessionStorage.getItem('admin_token')
    if (!t) { router.push('/admin'); return }
    setToken(t)
    loadProducts(t)
  }, [router])

  async function loadProducts(t: string) {
    const res = await fetch('/api/admin/products', { headers: { 'x-admin-token': t } })
    if (!res.ok) { router.push('/admin'); return }
    setProducts(await res.json())
  }

  function startNew() {
    setEditing(null)
    setForm(EMPTY)
    setShowForm(true)
  }

  function startEdit(p: Product) {
    setEditing(p)
    setForm({ name: p.name, description: p.description, price: p.price, image: p.image, category: p.category })
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const saved: Product = await res.json()
      if (editing) {
        setProducts(prev => prev.map(p => p.id === saved.id ? saved : p))
      } else {
        setProducts(prev => [...prev, saved])
      }
    }
    setShowForm(false)
    setSaving(false)
    setMsg(editing ? 'Producto actualizado ✓' : 'Producto agregado ✓')
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"?`)) return
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      setMsg(`Error al eliminar: ${err.error || res.status}`)
      setTimeout(() => setMsg(''), 4000)
      return
    }
    setProducts(prev => prev.filter(p => p.id !== id))
    setMsg('Producto eliminado')
    setTimeout(() => setMsg(''), 3000)
  }

  function logout() {
    sessionStorage.removeItem('admin_token')
    router.push('/admin')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-rose-800">Panel de Administración</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} productos en catálogo</p>
        </div>
        <div className="flex gap-3">
          <a
            href="https://dashboard.stripe.com/payments"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            💳 Ver pagos en Stripe
          </a>
          <button
            onClick={startNew}
            className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700 transition-colors"
          >
            + Nuevo producto
          </button>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-600 px-2">
            Salir
          </button>
        </div>
      </div>

      {msg && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-6 border border-green-200">
          {msg}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-rose-100">
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-5">
            {editing ? 'Editar producto' : 'Agregar nuevo producto'}
          </h2>
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Nombre del producto *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Ej: Docena de Rosas Rojas"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Descripción *</label>
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                placeholder="Descripción del arreglo..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Precio (USD) *</label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.price || ''}
                onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="35.00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Categoría *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">URL de la imagen *</label>
              <input
                required
                value={form.image}
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="https://images.unsplash.com/..."
              />
              {form.image && (
                <div className="relative mt-2 h-24 w-40 rounded-lg overflow-hidden border border-gray-100">
                  <Image src={form.image} alt="preview" fill className="object-cover" sizes="160px" />
                </div>
              )}
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Agregar producto'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Producto</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Categoría</th>
              <th className="text-right px-4 py-3">Precio</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-rose-50/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 leading-tight">{p.name}</p>
                      <p className="text-gray-400 text-xs line-clamp-1">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="bg-rose-50 text-rose-700 text-xs px-2 py-0.5 rounded-full">{p.category}</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-700">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enlace a tienda */}
      <div className="mt-6 text-center">
        <a href="/" target="_blank" className="text-sm text-rose-500 hover:text-rose-700 underline">
          Ver tienda →
        </a>
      </div>
    </div>
  )
}
