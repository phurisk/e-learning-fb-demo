"use client"
import type React from "react"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="font-sans antialiased">
      <Navigation />
      <main className="pt-16 lg:pt-20">{children}</main>
      <Toaster />
    </div>
  )
}
