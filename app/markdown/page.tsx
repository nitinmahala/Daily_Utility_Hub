"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, RefreshCw, FileDown, FileUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { marked } from "marked"

export default function MarkdownConverter() {
  const [markdown, setMarkdown] = useState("")
  const [html, setHtml] = useState("")
  const [activeTab, setActiveTab] = useState<"preview" | "html">("preview")

  useEffect(() => {
    if (markdown) {
      try {
        const convertedHtml = marked(markdown)
        setHtml(convertedHtml)
      } catch (error) {
        console.error("Error converting markdown:", error)
        setHtml("<p>Error converting markdown</p>")
      }
    } else {
      setHtml("")
    }
  }, [markdown])

  const clearMarkdown = () => {
    setMarkdown("")
    setHtml("")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html)
    toast({
      title: "Copied to clipboard",
      description: "HTML has been copied to your clipboard",
    })
  }

  const downloadHtml = () => {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted.html"
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
      setMarkdown(content)
    }
    reader.readAsText(file)

    // Reset the input so the same file can be selected again
    e.target.value = ""
  }

  const loadSampleMarkdown = () => {
    const sample = `# Markdown Sample

## Formatting

**Bold text** and *italic text*

## Lists

- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

1. First item
2. Second item
3. Third item

## Links and Images

[Visit GitHub](https://github.com)

![Placeholder Image](/placeholder.svg?height=150&width=300)

## Code

Inline \`code\` example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Blockquotes

> This is a blockquote
> It can span multiple lines

## Tables

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`
    setMarkdown(sample)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Markdown Converter</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Markdown Input</CardTitle>
            <CardDescription>Enter or upload Markdown to convert</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type or paste your Markdown here..."
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" onClick={clearMarkdown}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>

              <div className="relative">
                <Input
                  type="file"
                  accept=".md,.markdown,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button variant="outline">
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>

              <Button variant="outline" onClick={loadSampleMarkdown}>
                Load Sample
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Converted Output</CardTitle>
            <CardDescription>Preview or view the HTML output</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "preview" | "html")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-md p-4 min-h-[300px] overflow-auto bg-background">
                  {html ? (
                    <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
                  ) : (
                    <div className="text-muted-foreground text-center py-12">Preview will appear here</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="html" className="mt-4">
                <div className="relative">
                  <Textarea value={html} readOnly className="min-h-[300px] font-mono text-sm" />
                  {html && (
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy HTML">
                        <Clipboard className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={downloadHtml} title="Download HTML">
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}

// Hidden Input component for file upload
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />
}

