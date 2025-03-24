"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, RefreshCw } from "lucide-react"
import QRCode from "qrcode.react"

export default function QRGenerator() {
  const [text, setText] = useState("https://example.com")
  const [size, setSize] = useState(200)
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [fgColor, setFgColor] = useState("#000000")
  const [errorLevel, setErrorLevel] = useState("M")
  const [activeTab, setActiveTab] = useState("url")
  const qrRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset text when changing tabs
    setText(value === "url" ? "https://example.com" : "")
  }

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (canvas) {
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "qrcode.png"
      link.href = url
      link.click()
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">QR Code Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate QR Code</CardTitle>
            <CardDescription>Create a QR code for a URL, text, or contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="mt-4">
                <Label htmlFor="url-input">Enter URL</Label>
                <Input
                  id="url-input"
                  placeholder="https://example.com"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-1"
                />
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <Label htmlFor="text-input">Enter Text</Label>
                <Input
                  id="text-input"
                  placeholder="Your text here"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-1"
                />
              </TabsContent>
              <TabsContent value="contact" className="mt-4">
                <Label htmlFor="contact-input">Enter Contact Info</Label>
                <Input
                  id="contact-input"
                  placeholder="Name, Email, Phone"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Format: Name, Email, Phone</p>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <div>
                <Label htmlFor="size-slider">Size: {size}px</Label>
                <Slider
                  id="size-slider"
                  min={100}
                  max={400}
                  step={10}
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex mt-1">
                    <Input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="ml-2 flex-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fg-color">Foreground Color</Label>
                  <div className="flex mt-1">
                    <Input
                      id="fg-color"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="ml-2 flex-1" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="error-level">Error Correction Level</Label>
                <Select value={errorLevel} onValueChange={setErrorLevel}>
                  <SelectTrigger id="error-level" className="mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button onClick={() => setText("")} variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={downloadQRCode} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Scan with a QR code reader or download the image</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={qrRef}
              className="flex items-center justify-center bg-white rounded-lg p-4"
              style={{ minHeight: `${size + 40}px` }}
            >
              {text ? (
                <QRCode
                  value={text}
                  size={size}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level={errorLevel as "L" | "M" | "Q" | "H"}
                  includeMargin
                  renderAs="canvas"
                />
              ) : (
                <div className="text-center text-muted-foreground">Enter content to generate QR code</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

