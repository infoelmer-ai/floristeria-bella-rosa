import { NextResponse } from 'next/server'
import { readProducts } from '@/lib/productsDb'

export const dynamic = 'force-dynamic'

export async function GET() {
  const products = await readProducts()
  return NextResponse.json(products, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
