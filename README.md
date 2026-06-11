# 🌸 Floristería Bella Rosa — Tienda Online

Tienda en línea para floristería con pagos por tarjeta a través de Stripe. Construida con Next.js 14, TypeScript y Tailwind CSS.

## Requisitos

- [Node.js 18+](https://nodejs.org/) — Descargar e instalar primero
- Cuenta en [Stripe](https://stripe.com) (gratuita para pruebas)

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar el archivo de variables de entorno
copy .env.local.example .env.local

# 3. Editar .env.local con tus claves de Stripe
```

## Configurar Stripe

1. Crea una cuenta en [stripe.com](https://stripe.com)
2. Ve a **Developers → API keys**
3. Copia la **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Copia la **Secret key** → `STRIPE_SECRET_KEY`

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Probar pagos

Usa los datos de prueba de Stripe:
- **Tarjeta:** `4242 4242 4242 4242`
- **Fecha:** cualquier fecha futura
- **CVC:** cualquier 3 dígitos

## Estructura del proyecto

```
app/
  page.tsx          → Catálogo de productos
  cart/page.tsx     → Carrito de compras
  success/page.tsx  → Página de éxito post-pago
  api/
    checkout/       → Crea sesión de Stripe Checkout
    webhook/        → Recibe eventos de Stripe
components/
  Navbar.tsx        → Barra de navegación
  ProductCard.tsx   → Tarjeta de producto
lib/
  products.ts       → Catálogo de productos
  cartStore.ts      → Estado del carrito (Zustand)
```

## Personalizar productos

Edita `lib/products.ts` para cambiar los productos, precios e imágenes.

## Deploy a producción

Puedes hacer deploy en [Vercel](https://vercel.com) de forma gratuita:

```bash
npx vercel
```

Recuerda configurar las variables de entorno en el dashboard de Vercel y actualizar `NEXT_PUBLIC_BASE_URL` con tu dominio real.
