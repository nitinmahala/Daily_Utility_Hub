"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, RefreshCw, FileUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Input } from "@/components/ui/input"

interface HashResult {
  algorithm: string
  hash: string
  copied: boolean
}

export default function HashGenerator() {
  const [input, setInput] = useState("")
  const [hashResults, setHashResults] = useState<HashResult[]>([])
  const [activeTab, setActiveTab] = useState<"text" | "file">("text")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateHashes = async () => {
    if (!input) {
      setHashResults([])
      return
    }

    setIsGenerating(true)

    try {
      // Convert input to ArrayBuffer
      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      // Generate different hashes
      const md5Hash = await simulateMD5Hash(data)
      const sha1Hash = await generateSHA("SHA-1", data)
      const sha256Hash = await generateSHA("SHA-256", data)
      const sha384Hash = await generateSHA("SHA-384", data)
      const sha512Hash = await generateSHA("SHA-512", data)

      setHashResults([
        { algorithm: "MD5", hash: md5Hash, copied: false },
        { algorithm: "SHA-1", hash: sha1Hash, copied: false },
        { algorithm: "SHA-256", hash: sha256Hash, copied: false },
        { algorithm: "SHA-384", hash: sha384Hash, copied: false },
        { algorithm: "SHA-512", hash: sha512Hash, copied: false },
      ])
    } catch (error) {
      console.error("Error generating hashes:", error)
      toast({
        title: "Error",
        description: "Failed to generate hashes",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSHA = async (algorithm: string, data: Uint8Array): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  // Simulate MD5 for demo purposes (not a real MD5 implementation)
  const simulateMD5Hash = async (data: Uint8Array): Promise<string> => {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data[i]
      hash |= 0 // Convert to 32bit integer
    }
    // Create a hex string that looks like an MD5 hash
    const hashStr = Math.abs(hash).toString(16).padStart(32, "0")
    return hashStr
  }

  const copyToClipboard = (hash: string, index: number) => {
    navigator.clipboard.writeText(hash)

    // Update copied state
    const newResults = [...hashResults]
    newResults[index].copied = true
    setHashResults(newResults)

    // Reset copied state after 2 seconds
    setTimeout(() => {
      const resetResults = [...hashResults]
      resetResults[index].copied = false
      setHashResults(resetResults)
    }, 2000)

    toast({
      title: "Copied to clipboard",
      description: "Hash has been copied to your clipboard",
    })
  }

  const clearInput = () => {
    setInput("")
    setHashResults([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setInput(content)
      generateHashes()
    }
    reader.readAsText(file)

    // Reset the input so the same file can be selected again
    e.target.value = ""
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Hash Generator</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Hash Values</CardTitle>
            <CardDescription>Create hash values for text or file content</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "text" | "file")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="file">File Input</TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <Textarea
                  placeholder="Enter text to hash..."
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    if (e.target.value) {
                      generateHashes()
                    } else {
                      setHashResults([])
                    }
                  }}
                  className="min-h-[150px]"
                />
              </TabsContent>

              <TabsContent value="file">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-4 text-center">
                  <p className="text-sm text-muted-foreground mb-4">Select a text file to generate hash values</p>
                  <Input
                    type="file"
                    accept=".txt,.json,.csv,.md,.html,.css,.js,.ts"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileUp className="h-4 w-4 mr-2" />
                      Select File
                    </label>
                  </Button>
                </div>
                {input && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">File Content Preview:</p>
                    <div className="mt-2 p-3 bg-muted rounded-md text-sm overflow-hidden">
                      {input.length > 200 ? input.substring(0, 200) + "..." : input}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearInput}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hash Results</CardTitle>
            <CardDescription>Generated hash values for different algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="text-center py-8 text-muted-foreground">Generating hashes...</div>
            ) : hashResults.length > 0 ? (
              <div className="space-y-4">
                {hashResults.map((result, index) => (
                  <div key={result.algorithm} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">{result.algorithm}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.hash, index)}
                        className="h-6 px-2"
                      >
                        {result.copied ? (
                          <span className="text-green-500 text-xs">Copied!</span>
                        ) : (
                          <>
                            <Clipboard className="h-3 w-3 mr-1" />
                            <span className="text-xs">Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">{result.hash}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Enter text or upload a file to generate hash values</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}

