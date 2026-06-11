import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Floristería Bella Rosa | El Salvador',
  description: 'Las flores más frescas y hermosas para cada ocasión. Entrega a domicilio en El Salvador.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-rose-50 min-h-screen">
        <Navbar />
        <main>{children}</main>
        <footer className="bg-rose-900 text-white text-center py-6 mt-16">
          <p className="text-sm opacity-80">© 2024 Floristería Bella Rosa · El Salvador · Todos los derechos reservados</p>
        </footer>
      </body>
    </html>
  )
}
