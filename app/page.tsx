import { readProducts } from '@/lib/productsDb'
import CatalogClient from '@/components/CatalogClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await readProducts()
  return <CatalogClient initialProducts={products} />
}
