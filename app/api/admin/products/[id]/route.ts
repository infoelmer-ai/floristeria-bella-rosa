import { NextRequest, NextResponse } from 'next/server'
import { readProducts, writeProducts } from '@/lib/productsDb'

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-token') === process.env.ADMIN_PASSWORD
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const products = await readProducts()
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

  products[idx] = {
    ...products[idx],
    name: body.name,
    description: body.description,
    price: parseFloat(body.price),
    image: body.image,
    category: body.category,
  }
  await writeProducts(products)
  return NextResponse.json(products[idx])
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  try {
    const { id } = await params
    const products = await readProducts()
    const filtered = products.filter(p => p.id !== id)
    if (filtered.length === products.length) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    await writeProducts(filtered)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('DELETE error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
