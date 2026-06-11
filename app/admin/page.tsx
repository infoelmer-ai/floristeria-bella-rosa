'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/products', {
      headers: { 'x-admin-token': password },
    })

    if (res.ok) {
      sessionStorage.setItem('admin_token', password)
      router.push('/admin/productos')
    } else {
      setError('Contraseña incorrecta')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🌸</div>
        <h1 className="font-serif text-2xl font-semibold text-rose-800 mb-1">Panel Administrativo</h1>
        <p className="text-gray-400 text-sm mb-8">Floristería Bella Rosa</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
