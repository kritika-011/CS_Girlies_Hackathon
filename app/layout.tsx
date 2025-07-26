import type React from "react"
import type { Metadata } from "next"
import { Inter, Crimson_Text } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
})

export const metadata: Metadata = {
  title: "The Story Nook - Your AI Writing Companion",
  description:
    "Create worlds, characters, and stories with the gentle guidance of AI. Your cozy corner for creative writing awaits.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${crimsonText.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
