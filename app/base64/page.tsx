"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, RefreshCw, ArrowDownUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function Base64Converter() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    if (e.target.value === "") {
      setOutputText("")
    } else {
      processText(e.target.value)
    }
  }

  const processText = (text: string) => {
    try {
      if (mode === "encode") {
        setOutputText(btoa(text))
      } else {
        setOutputText(atob(text))
      }
    } catch (error) {
      setOutputText("Error: Invalid input for " + mode)
    }
  }

  const switchMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode"
    setMode(newMode)
    setInputText(outputText)
    setOutputText(inputText)
  }

  const clearText = () => {
    setInputText("")
    setOutputText("")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    })
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Base64 Encoder/Decoder</h1>

      <Tabs value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{mode === "encode" ? "Text to Encode" : "Base64 to Decode"}</CardTitle>
            <CardDescription>
              {mode === "encode" ? "Enter text to convert to Base64" : "Enter Base64 string to decode"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={mode === "encode" ? "Type or paste text here..." : "Type or paste Base64 string here..."}
              value={inputText}
              onChange={handleInputChange}
              className="min-h-[200px]"
            />
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" onClick={clearText} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button onClick={switchMode} className="flex-1">
                <ArrowDownUp className="mr-2 h-4 w-4" />
                Swap
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{mode === "encode" ? "Base64 Output" : "Decoded Text"}</CardTitle>
            <CardDescription>
              {mode === "encode" ? "Your text encoded as Base64" : "Your decoded Base64 string"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea value={outputText} readOnly className="min-h-[200px] bg-muted" />
              {outputText && (
                <Button variant="outline" size="icon" onClick={copyToClipboard} className="absolute top-2 right-2">
                  <Clipboard className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}

