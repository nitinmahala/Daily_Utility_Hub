"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { tools } from "@/lib/tools"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function AllTools() {
  // Group tools by category based on their icons
  const categories = {
    "Text Tools": tools.filter((tool) =>
      ["Text Case Converter", "Word Counter", "Markdown Converter"].includes(tool.name),
    ),
    "Data Conversion": tools.filter((tool) =>
      ["CSV to JSON Converter", "Base64 Encoder/Decoder", "JSON Formatter"].includes(tool.name),
    ),
    Generators: tools.filter((tool) =>
      ["Password Generator", "QR Code Generator", "Random Generator", "Hash Generator"].includes(tool.name),
    ),
    Calculators: tools.filter((tool) => ["Unit Converter", "Calculator", "Time Zone Converter"].includes(tool.name)),
    "Media & Design": tools.filter((tool) => ["Color Picker", "Image Compressor"].includes(tool.name)),
    Utilities: tools.filter((tool) => ["URL Shortener", "Note Keeper", "Regex Tester"].includes(tool.name)),
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">All Utilities</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse all available tools in the Daily Utility Hub
        </p>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search utilities..."
          className="pl-9"
          id="search-tools"
          onInput={(e) => {
            const searchTerm = e.currentTarget.value.toLowerCase()
            document.querySelectorAll(".tool-card").forEach((card) => {
              const cardText = card.textContent?.toLowerCase() || ""
              if (cardText.includes(searchTerm)) {
                ;(card as HTMLElement).style.display = "block"
              } else {
                ;(card as HTMLElement).style.display = "none"
              }
            })
          }}
        />
      </div>

      <Tabs defaultValue="grid" className="mb-6">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="category">Category View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div>

        {/* Grid View */}
        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="tool-card theme-card h-full group hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-200">
                      <span className="text-primary">{tool.icon}</span>
                      {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Category View */}
        <TabsContent value="category">
          <div className="space-y-8">
            {Object.entries(categories).map(([category, categoryTools]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTools.map((tool) => (
                    <Link key={tool.href} href={tool.href}>
                      <Card className="tool-card theme-card h-full group hover:shadow-md transition-all duration-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-200">
                            <span className="text-primary">{tool.icon}</span>
                            {tool.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list">
          <div className="space-y-2">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="tool-card hover:bg-muted/50 transition-colors duration-200">
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-4 text-primary">{tool.icon}</div>
                    <div>
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

