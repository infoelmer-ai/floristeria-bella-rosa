import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('Pago completado:', {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      total: session.amount_total ? session.amount_total / 100 : 0,
    })
    // Aquí puedes agregar lógica adicional:
    // - Enviar email de confirmación
    // - Guardar pedido en base de datos
    // - Notificar al equipo de la floristería
  }

  return NextResponse.json({ received: true })
}
