import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProConnect RH - Votre partenaire RH de confiance',
  description: 'Cabinet RH spécialisé dans le placement de personnel, traitement de la paie et formations RH pour PME et grandes entreprises.',
  keywords: 'RH, ressources humaines, placement personnel, paie, formations, cabinet RH, recrutement',
  authors: [{ name: 'ProConnect RH' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} font-inter bg-gray-50`}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {children}
      </body>
    </html>
  )
}