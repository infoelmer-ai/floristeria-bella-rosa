import fs from 'fs'
import path from 'path'
import type { Product } from './products'

const DB_PATH = path.join(process.cwd(), 'data', 'products.json')

export function readProducts(): Product[] {
  const raw = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(raw)
}

export function writeProducts(products: Product[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8')
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
