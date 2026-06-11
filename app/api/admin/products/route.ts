import { NextRequest, NextResponse } from 'next/server'
import { readProducts, writeProducts, slugify } from '@/lib/productsDb'
import type { Product } from '@/lib/products'

function checkAuth(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  return NextResponse.json(readProducts())
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await req.json()
  const products = readProducts()

  const newProduct: Product = {
    id: slugify(body.name) + '-' + Date.now(),
    name: body.name,
    description: body.description,
    price: parseFloat(body.price),
    image: body.image,
    category: body.category,
  }

  products.push(newProduct)
  writeProducts(products)
  return NextResponse.json(newProduct, { status: 201 })
}
