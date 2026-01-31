"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { queryClient as baseClient } from "@/lib/react-query"

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode
}) {
  const [queryClient] = useState(() => baseClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
