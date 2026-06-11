import { put, head, getDownloadUrl } from '@vercel/blob'
import type { Product } from './products'

const BLOB_KEY = 'products.json'

// Fallback: productos iniciales desde el JSON local (solo primer deploy)
async function getInitialProducts(): Promise<Product[]> {
  const { default: data } = await import('../data/products.json')
  return data as Product[]
}

export async function readProducts(): Promise<Product[]> {
  try {
    const blob = await head(BLOB_KEY).catch(() => null)
    if (!blob) return getInitialProducts()

    const url = await getDownloadUrl(BLOB_KEY)
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return getInitialProducts()
    return await res.json()
  } catch {
    return getInitialProducts()
  }
}

export async function writeProducts(products: Product[]): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(products, null, 2), {
    access: 'private',
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
