"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clipboard, RefreshCw, FileDown, FileUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState("")
  const [formattedJson, setFormattedJson] = useState("")
  const [error, setError] = useState("")
  const [indentSize, setIndentSize] = useState(2)

  const formatJson = () => {
    if (!jsonInput.trim()) {
      setFormattedJson("")
      setError("")
      return
    }

    try {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(jsonInput)

      // Format with the specified indent
      const formatted = JSON.stringify(parsedJson, null, indentSize)

      setFormattedJson(formatted)
      setError("")
    } catch (err) {
      setFormattedJson("")
      setError((err as Error).message)
    }
  }

  const minifyJson = () => {
    if (!jsonInput.trim()) {
      setFormattedJson("")
      setError("")
      return
    }

    try {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(jsonInput)

      // Minify by using no indentation
      const minified = JSON.stringify(parsedJson)

      setFormattedJson(minified)
      setError("")
    } catch (err) {
      setFormattedJson("")
      setError((err as Error).message)
    }
  }

  const clearJson = () => {
    setJsonInput("")
    setFormattedJson("")
    setError("")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJson)
    toast({
      title: "Copied to clipboard",
      description: "JSON has been copied to your clipboard",
    })
  }

  const downloadJson = () => {
    const blob = new Blob([formattedJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setJsonInput(content)

      // Auto-format after loading
      try {
        const parsedJson = JSON.parse(content)
        const formatted = JSON.stringify(parsedJson, null, indentSize)
        setFormattedJson(formatted)
        setError("")
      } catch (err) {
        setFormattedJson("")
        setError((err as Error).message)
      }
    }
    reader.readAsText(file)

    // Reset the input so the same file can be selected again
    e.target.value = ""
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">JSON Formatter</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input JSON</CardTitle>
            <CardDescription>Enter or upload JSON to format</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="indent-size">Indent Size:</Label>
                <Input
                  id="indent-size"
                  type="number"
                  min={0}
                  max={8}
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number.parseInt(e.target.value) || 0)}
                  className="w-16"
                />
              </div>

              <div className="flex space-x-2 sm:ml-auto">
                <Button variant="outline" onClick={clearJson}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <div className="relative">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button variant="outline">
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button onClick={formatJson}>Format JSON</Button>
              <Button variant="secondary" onClick={minifyJson}>
                Minify JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formatted Output</CardTitle>
            <CardDescription>
              {error ? <span className="text-red-500">Error: {error}</span> : "Your formatted JSON will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                value={formattedJson}
                readOnly
                className={`min-h-[300px] font-mono text-sm ${error ? "border-red-500" : ""}`}
              />
              {formattedJson && !error && (
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
                    <Clipboard className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={downloadJson} title="Download JSON">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {formattedJson && !error && (
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Characters: {formattedJson.length}</span>
                  <span>Size: {(new Blob([formattedJson]).size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}

