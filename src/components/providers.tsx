"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
      <Toaster richColors closeButton position="top-center" />
    </ThemeProvider>
  )
}
