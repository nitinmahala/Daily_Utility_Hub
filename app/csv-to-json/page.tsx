"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clipboard, RefreshCw, FileDown, FileUp, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function CsvToJsonConverter() {
  const [csvInput, setCsvInput] = useState("")
  const [jsonOutput, setJsonOutput] = useState("")
  const [delimiter, setDelimiter] = useState(",")
  const [hasHeader, setHasHeader] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const convertCsvToJson = () => {
    if (!csvInput.trim()) {
      setJsonOutput("")
      setError("")
      return
    }

    try {
      // Split the CSV into lines
      const lines = csvInput.split(/\r?\n/).filter((line) => line.trim() !== "")

      if (lines.length === 0) {
        setError("No data found")
        setJsonOutput("")
        return
      }

      let headers: string[] = []
      let startIndex = 0

      if (hasHeader) {
        // Use the first line as headers
        headers = lines[0].split(delimiter).map((header) => header.trim())
        startIndex = 1
      } else {
        // Generate column names (Column1, Column2, etc.)
        const columnCount = lines[0].split(delimiter).length
        headers = Array.from({ length: columnCount }, (_, i) => `Column${i + 1}`)
      }

      // Convert each line to an object
      const jsonData = []
      for (let i = startIndex; i < lines.length; i++) {
        const values = lines[i].split(delimiter)
        const row: Record<string, string> = {}

        headers.forEach((header, index) => {
          row[header] = values[index] ? values[index].trim() : ""
        })

        jsonData.push(row)
      }

      setJsonOutput(JSON.stringify(jsonData, null, 2))
      setError("")
    } catch (err) {
      setError("Error converting CSV to JSON. Please check your input format.")
      setJsonOutput("")
    }
  }

  const clearData = () => {
    setCsvInput("")
    setJsonOutput("")
    setError("")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "JSON has been copied to your clipboard",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const downloadJson = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted.json"
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
      setCsvInput(content)
    }
    reader.readAsText(file)

    // Reset the input so the same file can be selected again
    e.target.value = ""
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">CSV to JSON Converter</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CSV Input</CardTitle>
            <CardDescription>Enter or upload CSV data to convert</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your CSV data here..."
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="delimiter">Delimiter</Label>
                <Input
                  id="delimiter"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="mt-1"
                  placeholder="Delimiter character"
                  maxLength={1}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Switch id="has-header" checked={hasHeader} onCheckedChange={setHasHeader} />
                  <Label htmlFor="has-header">First row is header</Label>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={convertCsvToJson}>Convert to JSON</Button>
              <Button variant="outline" onClick={clearData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <div className="relative">
                <Input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button variant="outline">
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JSON Output</CardTitle>
            <CardDescription>
              {error ? <span className="text-red-500">{error}</span> : "Your converted JSON will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                value={jsonOutput}
                readOnly
                className={`min-h-[300px] font-mono text-sm ${error ? "border-red-500" : ""}`}
              />
              {jsonOutput && !error && (
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={downloadJson} title="Download JSON">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {jsonOutput && !error && (
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Records: {JSON.parse(jsonOutput).length}</span>
                  <span>Size: {(new Blob([jsonOutput]).size / 1024).toFixed(2)} KB</span>
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

