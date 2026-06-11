import { NextRequest, NextResponse } from 'next/server'
import { list, getDownloadUrl } from '@vercel/blob'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (req.headers.get('x-admin-token') !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const all = await list()
    const items = await Promise.all(
      all.blobs.map(async b => {
        let preview: any = null
        try {
          const signed = await getDownloadUrl(b.url)
          const r = await fetch(signed, { cache: 'no-store' })
          const text = await r.text()
          try {
            const parsed = JSON.parse(text)
            preview = Array.isArray(parsed) ? { count: parsed.length, names: parsed.map((p: any) => p.name) } : 'not-array'
          } catch {
            preview = { rawSnippet: text.slice(0, 200), status: r.status }
          }
        } catch (e) {
          preview = `fetch-error: ${String(e)}`
        }
        return {
          pathname: b.pathname,
          url: b.url,
          uploadedAt: b.uploadedAt,
          size: b.size,
          preview,
        }
      })
    )
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
