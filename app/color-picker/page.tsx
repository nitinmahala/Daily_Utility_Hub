"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Clipboard, History } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface ColorHistory {
  hex: string
  timestamp: number
}

export default function ColorPicker() {
  const [color, setColor] = useState("#6366f1")
  const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 })
  const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 })
  const [history, setHistory] = useState<ColorHistory[]>([])

  useEffect(() => {
    // Load color history from localStorage
    const savedHistory = localStorage.getItem("colorHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    // Update RGB and HSL when hex color changes
    const r = Number.parseInt(color.slice(1, 3), 16)
    const g = Number.parseInt(color.slice(3, 5), 16)
    const b = Number.parseInt(color.slice(5, 7), 16)

    setRgb({ r, g, b })

    // Convert RGB to HSL
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255

    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)
    const delta = max - min

    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

      if (max === rNorm) {
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60
      } else if (max === gNorm) {
        h = ((bNorm - rNorm) / delta + 2) * 60
      } else {
        h = ((rNorm - gNorm) / delta + 4) * 60
      }
    }

    setHsl({
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    })
  }, [color])

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Ensure the value starts with #
    if (!value.startsWith("#")) {
      value = "#" + value
    }

    // Validate hex color format
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setColor(value)
      addToHistory(value)
    } else if (/^#[0-9A-Fa-f]{0,5}$/.test(value)) {
      // Allow partial input while typing
      setColor(value)
    }
  }

  const handleRgbChange = (channel: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [channel]: value }
    setRgb(newRgb)

    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setColor(hex)
    addToHistory(hex)
  }

  const handleHslChange = (channel: "h" | "s" | "l", value: number) => {
    const newHsl = { ...hsl, [channel]: value }
    setHsl(newHsl)

    const rgbColor = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(rgbColor)

    const hex = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b)
    setColor(hex)
    addToHistory(hex)
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r = 0,
      g = 0,
      b = 0

    if (h >= 0 && h < 60) {
      r = c
      g = x
      b = 0
    } else if (h >= 60 && h < 120) {
      r = x
      g = c
      b = 0
    } else if (h >= 120 && h < 180) {
      r = 0
      g = c
      b = x
    } else if (h >= 180 && h < 240) {
      r = 0
      g = x
      b = c
    } else if (h >= 240 && h < 300) {
      r = x
      g = 0
      b = c
    } else {
      r = c
      g = 0
      b = x
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    }
  }

  const addToHistory = (hexColor: string) => {
    // Only add to history if it's a valid hex color and different from the last one
    if (/^#[0-9A-Fa-f]{6}$/.test(hexColor) && (history.length === 0 || history[0].hex !== hexColor)) {
      const newHistory = [
        { hex: hexColor, timestamp: Date.now() },
        ...history.filter((item) => item.hex !== hexColor).slice(0, 9),
      ]

      setHistory(newHistory)
      localStorage.setItem("colorHistory", JSON.stringify(newHistory))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: text,
    })
  }

  const selectFromHistory = (hexColor: string) => {
    setColor(hexColor)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Color Picker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Color Selector</CardTitle>
            <CardDescription>Choose a color using the color picker or input values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="w-full h-32 rounded-lg mb-4 border" style={{ backgroundColor: color }}></div>

              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value)
                    addToHistory(e.target.value)
                  }}
                  className="w-12 h-10 p-1"
                />
                <Input type="text" value={color} onChange={handleHexChange} className="flex-1" maxLength={7} />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(color)}>
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="rgb">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
              </TabsList>

              <TabsContent value="rgb" className="space-y-4 pt-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Red: {rgb.r}</Label>
                    <span className="text-muted-foreground text-sm">0-255</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Slider
                      min={0}
                      max={255}
                      step={1}
                      value={[rgb.r]}
                      onValueChange={(value) => handleRgbChange("r", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb.r}
                      onChange={(e) => handleRgbChange("r", Number.parseInt(e.target.value) || 0)}
                      className="w-16"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Green: {rgb.g}</Label>
                    <span className="text-muted-foreground text-sm">0-255</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Slider
                      min={0}
                      max={255}
                      step={1}
                      value={[rgb.g]}
                      onValueChange={(value) => handleRgbChange("g", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb.g}
                      onChange={(e) => handleRgbChange("g", Number.parseInt(e.target.value) || 0)}
                      className="w-16"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Blue: {rgb.b}</Label>
                    <span className="text-muted-foreground text-sm">0-255</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Slider
                      min={0}
                      max={255}
                      step={1}
                      value={[rgb.b]}
                      onValueChange={(value) => handleRgbChange("b", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb.b}
                      onChange={(e) => handleRgbChange("b", Number.parseInt(e.target.value) || 0)}
                      className="w-16"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  >
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy RGB: rgb({rgb.r}, {rgb.g}, {rgb.b})
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="hsl" className="space-y-4 pt-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Hue: {hsl.h}°</Label>
                    <span className="text-muted-foreground text-sm">0-360</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Slider
                      min={0}
                      max={360}
                      step={1}
                      value={[hsl.h]}
                      onValueChange={(value) => handleHslChange("h", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={360}
                      value={hsl.h}
                      onChange={(e) => handleHslChange("h", Number.parseInt(e.target.value) || 0)}
                      className="w-16"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Saturation: {hsl.s}%</Label>
                    <span className="text-muted-foreground text-sm">0-100</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[hsl.s]}
                      onValueChange={(value) => handleHslChange("s", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={hsl.s}
                      onChange={(e) => handleHslChange("s", Number.parseInt(e.target.value) || 0)}
                      className="w-16"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Lightness: {hsl.l}%</Label>
                    <span className="text-muted-foreground text-sm">0-100</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[hsl.l]}
                      onValueChange={(value) => handleHslChange("l", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={hsl.l}
                      onChange={(e) => handleHslChange("l", Number.parseInt(e.target.value) || 0)}
                      className="w-16"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                  >
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy HSL: hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Information</CardTitle>
            <CardDescription>Color values and history</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="values">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="values">Values</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="values" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">HEX</Label>
                    <div className="flex mt-1">
                      <Input value={color} readOnly className="flex-1" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(color)} className="ml-2">
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">RGB</Label>
                    <div className="flex mt-1">
                      <Input value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className="flex-1" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                        className="ml-2"
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">HSL</Label>
                    <div className="flex mt-1">
                      <Input value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly className="flex-1" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                        className="ml-2"
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">CSS Variable</Label>
                    <div className="flex mt-1">
                      <Input value={`--color: ${color};`} readOnly className="flex-1" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(`--color: ${color};`)}
                        className="ml-2"
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="pt-4">
                {history.length > 0 ? (
                  <div className="grid grid-cols-5 gap-2">
                    {history.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full h-12 p-1"
                        style={{ backgroundColor: item.hex }}
                        onClick={() => selectFromHistory(item.hex)}
                        title={item.hex}
                      >
                        <span className="sr-only">{item.hex}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No color history yet</p>
                    <p className="text-sm">Colors will appear here as you select them</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}

