import { NextRequest, NextResponse } from 'next/server'
import { readProducts, writeProducts } from '@/lib/productsDb'

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-token') === process.env.ADMIN_PASSWORD
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await req.json()
  const products = readProducts()
  const idx = products.findIndex(p => p.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

  products[idx] = {
    ...products[idx],
    name: body.name,
    description: body.description,
    price: parseFloat(body.price),
    image: body.image,
    category: body.category,
  }
  writeProducts(products)
  return NextResponse.json(products[idx])
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const products = readProducts()
  const filtered = products.filter(p => p.id !== params.id)
  if (filtered.length === products.length) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }
  writeProducts(filtered)
  return NextResponse.json({ ok: true })
}
