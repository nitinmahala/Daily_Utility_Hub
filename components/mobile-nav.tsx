"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { tools } from "@/lib/tools"
import { ModeToggle } from "./mode-toggle"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Ensure "All Utilities" is at the top
  const allUtilitiesItem = tools.find((tool) => tool.href === "/all")
  const otherTools = tools.filter((tool) => tool.href !== "/all")

  return (
    <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 flex items-center justify-between z-20">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="glass-input">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="font-semibold text-xl text-primary" onClick={() => setOpen(false)}>
              Daily Utility Hub
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {/* All Utilities link at the top */}
            {allUtilitiesItem && (
              <Link key={allUtilitiesItem.href} href={allUtilitiesItem.href} onClick={() => setOpen(false)}>
                <Button
                  variant={pathname === allUtilitiesItem.href ? "default" : "ghost"}
                  className={`w-full justify-start ${pathname === allUtilitiesItem.href ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                >
                  <span className={`mr-2 ${pathname === allUtilitiesItem.href ? "text-white" : ""}`}>
                    {allUtilitiesItem.icon}
                  </span>
                  {allUtilitiesItem.name}
                </Button>
              </Link>
            )}

            {/* Divider after All Utilities */}
            <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>

            {/* Other tools */}
            {otherTools.map((tool) => {
              const isActive = pathname === tool.href
              return (
                <Link key={tool.href} href={tool.href} onClick={() => setOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    <span className={`mr-2 ${isActive ? "text-white" : ""}`}>{tool.icon}</span>
                    {tool.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <Link href="/" className="font-semibold text-xl text-primary">
        Daily Utility Hub
      </Link>
      <ModeToggle />
    </div>
  )
}

