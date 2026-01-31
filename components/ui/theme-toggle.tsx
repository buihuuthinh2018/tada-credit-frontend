"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
      </div>
    )
  }

  const themes = [
    { name: "light", label: "Sáng", icon: Sun },
    { name: "dark", label: "Tối", icon: Moon },
    { name: "system", label: "Hệ thống", icon: Monitor },
  ]

  return (
    <div className="flex gap-1 rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm p-1 shadow-sm">
      {themes.map((t) => {
        const Icon = t.icon
        const isActive = theme === t.name
        
        return (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            title={t.label}
            className={cn(
              "flex items-center justify-center rounded-md p-2 transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
