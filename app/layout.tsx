// next
import type { Metadata } from "next"

// font
import { Inter, Satisfy } from "next/font/google"

// css
import "@/assets/css/globals.css"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// font
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// title
const title = Satisfy({
    weight: ['400'],
    subsets: ['latin'],
    variable: '--font-title'
})

// all
const text = Inter({
    weight: ['400', '700'],
    subsets: ['latin'],
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// metadata
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const metadata: Metadata = {
    title: "Pizzeria Belvedere Senago – Pizza al Trancio Alta e Soffice dal 1996",
    description: "Scopri la Pizzeria Belvedere a Senago: dal 1996, specialità in pizza al trancio alta e soffice, realizzata con ingredienti selezionati e impasto fresco ogni giorno. Servizio cordiale, porzioni generose e consegna a domicilio da martedì a venerdì.",
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="it">
            <body className={`${text.className} ${title.variable} antialiased`}>
                {children}
            </body>
        </html>
    )
}
