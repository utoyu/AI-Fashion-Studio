"use client"

import * as React from "react"
import { Moon, Sun, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site-content"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // Or a skeleton matching the size
    }

    return (
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-card/50">
            <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-all ${theme === "light" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                onClick={() => setTheme("light")}
                title={siteConfig.themeToggle.light}
            >
                <Sun className="h-4 w-4" />
                <span className="sr-only">Light</span>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-all ${theme === "dark" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                onClick={() => setTheme("dark")}
                title={siteConfig.themeToggle.dark}
            >
                <Moon className="h-4 w-4" />
                <span className="sr-only">Dark</span>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-all ${theme === "cream" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                onClick={() => setTheme("cream")}
                title={siteConfig.themeToggle.cream}
            >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">Cream</span>
            </Button>
        </div>
    )
}
