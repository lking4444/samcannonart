import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"

import "./globals.css"

export const metadata: Metadata = {
  title: "Sam Cannon Art",
  description: "Original artwork and related products by Sam Cannon Art",
}

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <div className="appShell">
          <div className="pageContent">{children}</div>

          <footer className="siteFooter">
            <Link href="/Privacy" className="footerButton">
              Privacy Policy
            </Link>
          </footer>
        </div>
      </body>
    </html>
  )
}
