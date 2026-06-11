import { unstable_noStore as noStore } from 'next/cache'
import { put, list } from '@vercel/blob'
import type { Product } from './products'

const BLOB_PATHNAME = 'products-v2.json'

async function getInitialProducts(): Promise<Product[]> {
  const { default: data } = await import('../data/products.json')
  return data as Product[]
}

export async function readProducts(): Promise<Product[]> {
  noStore()
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME })
    if (!blobs.length) return getInitialProducts()

    const latest = blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]
    const res = await fetch(latest.url, { cache: 'no-store' })
    if (!res.ok) return getInitialProducts()
    return await res.json()
  } catch {
    return getInitialProducts()
  }
}

export async function writeProducts(products: Product[]): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(products, null, 2), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  })
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
