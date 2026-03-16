import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Chat Wrapped — Find out who your group chat really is",
  description: "Upload your WhatsApp chat export and get a brutalist Spotify Wrapped-style breakdown of your group chat stats, roasts, and more.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0a0a0a" }}>
        {children}
      </body>
    </html>
  )
}
