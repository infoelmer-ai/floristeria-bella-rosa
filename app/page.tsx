import { readProducts } from '@/lib/productsDb'
import CatalogClient from '@/components/CatalogClient'

export const dynamic = 'force-dynamic'

export default function Home() {
  const products = readProducts()
  return <CatalogClient products={products} />
}
