import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'

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
          const r = await fetch(b.downloadUrl, { cache: 'no-store' })
          const text = await r.text()
          const parsed = JSON.parse(text)
          preview = Array.isArray(parsed) ? { count: parsed.length, names: parsed.map((p: any) => p.name) } : 'not-array'
        } catch (e) {
          preview = 'parse-error'
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
