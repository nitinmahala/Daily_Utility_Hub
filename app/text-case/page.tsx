"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function TextCaseConverter() {
  const [text, setText] = useState("")
  const [convertedText, setConvertedText] = useState("")
  const [activeTab, setActiveTab] = useState("uppercase")

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    convertText(e.target.value, activeTab)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    convertText(text, value)
  }

  const convertText = (input: string, type: string) => {
    if (!input) {
      setConvertedText("")
      return
    }

    switch (type) {
      case "uppercase":
        setConvertedText(input.toUpperCase())
        break
      case "lowercase":
        setConvertedText(input.toLowerCase())
        break
      case "titlecase":
        setConvertedText(
          input
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        )
        break
      case "sentencecase":
        setConvertedText(input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()))
        break
      case "alternatingcase":
        setConvertedText(
          input
            .split("")
            .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
            .join(""),
        )
        break
      case "inversecase":
        setConvertedText(
          input
            .split("")
            .map((char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
            .join(""),
        )
        break
      default:
        setConvertedText(input)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedText)
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    })
  }

  const clearText = () => {
    setText("")
    setConvertedText("")
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Text Case Converter</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>Enter or paste your text to convert</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type or paste your text here..."
              value={text}
              onChange={handleTextChange}
              className="min-h-[200px]"
            />
            <Button variant="outline" onClick={clearText} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Text
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Converted Text</CardTitle>
            <CardDescription>Choose a conversion type below</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-4">
              <TabsList className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                <TabsTrigger value="uppercase">UPPERCASE</TabsTrigger>
                <TabsTrigger value="lowercase">lowercase</TabsTrigger>
                <TabsTrigger value="titlecase">Title Case</TabsTrigger>
                <TabsTrigger value="sentencecase">Sentence case</TabsTrigger>
                <TabsTrigger value="alternatingcase">aLtErNaTiNg</TabsTrigger>
                <TabsTrigger value="inversecase">InVeRsE cAsE</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative">
              <Textarea value={convertedText} readOnly className="min-h-[200px] bg-muted" />
              {convertedText && (
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

