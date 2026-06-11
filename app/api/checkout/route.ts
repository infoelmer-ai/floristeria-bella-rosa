import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

interface CheckoutItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface DeliveryData {
  recipientName: string
  recipientPhone: string
  address: string
  references: string
  deliveryDate: string
  deliveryTime: string
  dedication: string
}

export async function POST(req: NextRequest) {
  try {
    const { items, delivery }: { items: CheckoutItem[]; delivery?: DeliveryData } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    if (!delivery || !delivery.recipientName || !delivery.recipientPhone || !delivery.address || !delivery.deliveryDate) {
      return NextResponse.json({ error: 'Faltan datos de entrega' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      locale: 'es',
      currency: 'usd',
      phone_number_collection: { enabled: true },
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        recipient_name: delivery.recipientName,
        recipient_phone: delivery.recipientPhone,
        address: delivery.address,
        references: delivery.references || '',
        delivery_date: delivery.deliveryDate,
        delivery_time: delivery.deliveryTime || 'Cualquier hora',
        dedication: delivery.dedication || '',
      },
      payment_intent_data: {
        metadata: {
          recipient_name: delivery.recipientName,
          recipient_phone: delivery.recipientPhone,
          address: delivery.address,
          references: delivery.references || '',
          delivery_date: delivery.deliveryDate,
          delivery_time: delivery.deliveryTime || 'Cualquier hora',
          dedication: delivery.dedication || '',
        },
      },
      custom_text: {
        submit: {
          message: `Entregaremos el pedido a ${delivery.recipientName} el ${delivery.deliveryDate}. Nos pondremos en contacto para coordinar.`,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    const message = err instanceof Error ? err.message : 'Error interno del servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
