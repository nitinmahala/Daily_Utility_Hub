"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  readingTime: number
}

export default function WordCounter() {
  const [text, setText] = useState("")
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  })

  useEffect(() => {
    analyzeText(text)
  }, [text])

  const analyzeText = (input: string) => {
    // Characters
    const characters = input.length
    const charactersNoSpaces = input.replace(/\s/g, "").length

    // Words
    const words = input.trim() === "" ? 0 : input.trim().split(/\s+/).length

    // Sentences
    const sentences = input === "" ? 0 : input.split(/[.!?]+/).filter(Boolean).length

    // Paragraphs
    const paragraphs = input === "" ? 0 : input.split(/\n+/).filter((line) => line.trim() !== "").length

    // Reading time (average reading speed: 200 words per minute)
    const readingTime = Math.max(1, Math.ceil(words / 200))

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    })
  }

  const clearText = () => {
    setText("")
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Word Counter</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Text Input</CardTitle>
              <CardDescription>Type or paste your text to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  placeholder="Start typing or paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                {text && (
                  <Button variant="outline" size="sm" onClick={clearText} className="absolute top-2 right-2">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Text Statistics</CardTitle>
              <CardDescription>Real-time analysis of your text</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold">{stats.words}</div>
                      <div className="text-sm text-muted-foreground">Words</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold">{stats.characters}</div>
                      <div className="text-sm text-muted-foreground">Characters</div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">{stats.readingTime}</div>
                    <div className="text-sm text-muted-foreground">
                      {stats.readingTime === 1 ? "Minute" : "Minutes"} to read
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="detailed" className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span>Characters (with spaces)</span>
                      <span className="font-medium">{stats.characters}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Characters (no spaces)</span>
                      <span className="font-medium">{stats.charactersNoSpaces}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Words</span>
                      <span className="font-medium">{stats.words}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Sentences</span>
                      <span className="font-medium">{stats.sentences}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Paragraphs</span>
                      <span className="font-medium">{stats.paragraphs}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Reading Time</span>
                      <span className="font-medium">{stats.readingTime} min</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

