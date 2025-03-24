"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { tools } from "@/lib/tools"
import { ModeToggle } from "./mode-toggle"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [minimized, setMinimized] = useState(false)

  // Load minimized state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-minimized")
    if (savedState !== null) {
      setMinimized(savedState === "true")
    }
  }, [])

  // Save minimized state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-minimized", minimized.toString())
  }, [minimized])

  const toggleMinimized = () => {
    setMinimized(!minimized)
  }

  // Ensure "All Utilities" is at the top
  const allUtilitiesItem = tools.find((tool) => tool.href === "/all")
  const otherTools = tools.filter((tool) => tool.href !== "/all")

  return (
    <>
      <div
        className={`hidden border-r border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md h-screen md:flex md:flex-col md:fixed md:inset-y-0 z-20 transition-all duration-300 ${
          minimized ? "md:w-16" : "md:w-72"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            {!minimized && (
              <Link href="/" className="font-semibold text-xl text-primary truncate">
                Daily Utility Hub
              </Link>
            )}
            <div className="flex items-center ml-auto">
              {!minimized && <ModeToggle />}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMinimized}
                className="ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {minimized ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {/* All Utilities link at the top */}
            {allUtilitiesItem && (
              <Link key={allUtilitiesItem.href} href={allUtilitiesItem.href}>
                <Button
                  variant={pathname === allUtilitiesItem.href ? "default" : "ghost"}
                  className={`w-full justify-start ${pathname === allUtilitiesItem.href ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 dark:hover:bg-gray-800"} ${
                    minimized ? "px-0 justify-center" : ""
                  }`}
                  title={minimized ? allUtilitiesItem.name : undefined}
                >
                  <span
                    className={`${pathname === allUtilitiesItem.href ? "text-white" : ""} ${minimized ? "" : "mr-2"}`}
                  >
                    {allUtilitiesItem.icon}
                  </span>
                  {!minimized && allUtilitiesItem.name}
                </Button>
              </Link>
            )}

            {/* Divider after All Utilities */}
            <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>

            {/* Other tools */}
            {otherTools.map((tool) => {
              const isActive = pathname === tool.href
              return (
                <Link key={tool.href} href={tool.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 dark:hover:bg-gray-800"} ${
                      minimized ? "px-0 justify-center" : ""
                    }`}
                    title={minimized ? tool.name : undefined}
                  >
                    <span className={`${isActive ? "text-white" : ""} ${minimized ? "" : "mr-2"}`}>{tool.icon}</span>
                    {!minimized && tool.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
          {minimized && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <ModeToggle />
            </div>
          )}
        </div>
      </div>

      {/* Add margin to main content when sidebar is expanded */}
      <div className={`hidden md:block transition-all duration-300 ${minimized ? "md:ml-16" : "md:ml-72"}`}></div>
    </>
  )
}
