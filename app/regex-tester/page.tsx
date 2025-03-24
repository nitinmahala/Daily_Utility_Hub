"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Clipboard, RefreshCw, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"

interface RegexMatch {
  text: string
  index: number
  length: number
}

interface RegexPattern {
  id: string
  pattern: string
  flags: string
  description: string
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [testText, setTestText] = useState("")
  const [matches, setMatches] = useState<RegexMatch[]>([])
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [savedPatterns, setSavedPatterns] = useState<RegexPattern[]>([])
  const [patternDescription, setPatternDescription] = useState("")

  // Flags
  const [globalFlag, setGlobalFlag] = useState(true)
  const [caseInsensitiveFlag, setCaseInsensitiveFlag] = useState(false)
  const [multilineFlag, setMultilineFlag] = useState(false)
  const [dotAllFlag, setDotAllFlag] = useState(false)
  const [unicodeFlag, setUnicodeFlag] = useState(false)
  const [stickyFlag, setStickyFlag] = useState(false)

  // Load saved patterns from localStorage
  useEffect(() => {
    const savedPatternsJson = localStorage.getItem("regex-patterns")
    if (savedPatternsJson) {
      try {
        setSavedPatterns(JSON.parse(savedPatternsJson))
      } catch (e) {
        console.error("Error loading saved patterns:", e)
      }
    }
  }, [])

  // Update flags when individual flags change
  useEffect(() => {
    let newFlags = ""
    if (globalFlag) newFlags += "g"
    if (caseInsensitiveFlag) newFlags += "i"
    if (multilineFlag) newFlags += "m"
    if (dotAllFlag) newFlags += "s"
    if (unicodeFlag) newFlags += "u"
    if (stickyFlag) newFlags += "y"

    setFlags(newFlags)
  }, [globalFlag, caseInsensitiveFlag, multilineFlag, dotAllFlag, unicodeFlag, stickyFlag])

  // Test regex when pattern, flags, or test text changes
  useEffect(() => {
    if (pattern && testText) {
      testRegex()
    } else {
      setMatches([])
    }
  }, [pattern, flags, testText])

  const testRegex = () => {
    setMatches([])
    setIsValid(true)
    setErrorMessage("")

    if (!pattern || !testText) return

    try {
      const regex = new RegExp(pattern, flags)

      // Find all matches
      const allMatches: RegexMatch[] = []

      if (flags.includes("g")) {
        let match
        const tempText = testText
        const offset = 0

        // Use a safer approach to avoid infinite loops
        const maxIterations = 1000
        let iterations = 0

        while ((match = regex.exec(tempText)) !== null && iterations < maxIterations) {
          iterations++
          allMatches.push({
            text: match[0],
            index: match.index + offset,
            length: match[0].length,
          })

          // If the match has zero length, move forward to avoid infinite loop
          if (match.index === regex.lastIndex) {
            regex.lastIndex++
          }

          // If we've reached the end of the string, break
          if (regex.lastIndex >= tempText.length) {
            break
          }
        }
      } else {
        const match = regex.exec(testText)
        if (match) {
          allMatches.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
          })
        }
      }

      setMatches(allMatches)
    } catch (error) {
      setIsValid(false)
      setErrorMessage((error as Error).message)
    }
  }

  const clearAll = () => {
    setPattern("")
    setFlags("g")
    setTestText("")
    setMatches([])
    setIsValid(true)
    setErrorMessage("")
    setPatternDescription("")

    // Reset flags
    setGlobalFlag(true)
    setCaseInsensitiveFlag(false)
    setMultilineFlag(false)
    setDotAllFlag(false)
    setUnicodeFlag(false)
    setStickyFlag(false)
  }

  const savePattern = () => {
    if (!pattern) {
      toast({
        title: "Cannot save empty pattern",
        description: "Please enter a regular expression pattern",
        variant: "destructive",
      })
      return
    }

    const newPattern: RegexPattern = {
      id: Date.now().toString(),
      pattern,
      flags,
      description: patternDescription || `Pattern: ${pattern}`,
    }

    const updatedPatterns = [...savedPatterns, newPattern]
    setSavedPatterns(updatedPatterns)
    localStorage.setItem("regex-patterns", JSON.stringify(updatedPatterns))

    toast({
      title: "Pattern saved",
      description: "Your regular expression has been saved",
    })
  }

  const loadPattern = (savedPattern: RegexPattern) => {
    setPattern(savedPattern.pattern)
    setFlags(savedPattern.flags)
    setPatternDescription(savedPattern.description)

    // Update individual flags
    setGlobalFlag(savedPattern.flags.includes("g"))
    setCaseInsensitiveFlag(savedPattern.flags.includes("i"))
    setMultilineFlag(savedPattern.flags.includes("m"))
    setDotAllFlag(savedPattern.flags.includes("s"))
    setUnicodeFlag(savedPattern.flags.includes("u"))
    setStickyFlag(savedPattern.flags.includes("y"))
  }

  const deletePattern = (id: string) => {
    const updatedPatterns = savedPatterns.filter((p) => p.id !== id)
    setSavedPatterns(updatedPatterns)
    localStorage.setItem("regex-patterns", JSON.stringify(updatedPatterns))

    toast({
      title: "Pattern deleted",
      description: "The saved pattern has been removed",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: text,
    })
  }

  const loadSampleText = () => {
    setTestText(`John Doe, john.doe@example.com, 555-123-4567
Jane Smith, jane_smith@company.co.uk, (555) 987-6543
Bob Johnson, bob.johnson@mail.org, 555.765.4321
Alice Brown, alice22@email.net, 5551234567
123 Main St, New York, NY 10001
https://www.example.com/path/to/page.html?query=value#section
<div class="container">This is some <strong>HTML</strong> content.</div>
2023-05-15, $1,234.56, 75%
The quick brown fox jumps over the lazy dog.`)
  }

  const highlightMatches = () => {
    if (!testText || matches.length === 0) return testText

    // Create a safe version for HTML display
    const safeText = testText.replace(/</g, "&lt;").replace(/>/g, "&gt;")

    let result = ""
    let lastIndex = 0

    // Sort matches by index to process them in order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index)

    for (const match of sortedMatches) {
      // Add text before the match
      result += safeText.substring(lastIndex, match.index)

      // Add the highlighted match
      result += `<mark>${safeText.substring(match.index, match.index + match.length)}</mark>`

      // Update the last index
      lastIndex = match.index + match.length
    }

    // Add any remaining text
    result += safeText.substring(lastIndex)

    return result
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Regex Tester</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regular Expression</CardTitle>
            <CardDescription>Enter your regex pattern and flags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pattern">Pattern</Label>
                <div className="flex mt-1">
                  <div className="flex-none text-center px-3 py-2 border border-r-0 rounded-l-md bg-muted">/</div>
                  <Input
                    id="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter regex pattern"
                    className="rounded-none"
                  />
                  <div className="flex-none text-center px-3 py-2 border border-l-0 rounded-r-md bg-muted">
                    /{flags}
                  </div>
                </div>
                {!isValid && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={patternDescription}
                  onChange={(e) => setPatternDescription(e.target.value)}
                  placeholder="What does this regex do?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="block mb-2">Flags</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="global-flag" checked={globalFlag} onCheckedChange={setGlobalFlag} />
                    <Label htmlFor="global-flag">Global (g)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="case-insensitive-flag"
                      checked={caseInsensitiveFlag}
                      onCheckedChange={setCaseInsensitiveFlag}
                    />
                    <Label htmlFor="case-insensitive-flag">Case Insensitive (i)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="multiline-flag" checked={multilineFlag} onCheckedChange={setMultilineFlag} />
                    <Label htmlFor="multiline-flag">Multiline (m)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="dotall-flag" checked={dotAllFlag} onCheckedChange={setDotAllFlag} />
                    <Label htmlFor="dotall-flag">Dot All (s)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="unicode-flag" checked={unicodeFlag} onCheckedChange={setUnicodeFlag} />
                    <Label htmlFor="unicode-flag">Unicode (u)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sticky-flag" checked={stickyFlag} onCheckedChange={setStickyFlag} />
                    <Label htmlFor="sticky-flag">Sticky (y)</Label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" onClick={clearAll} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button onClick={savePattern} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save Pattern
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Text</CardTitle>
            <CardDescription>Enter text to test against your regex</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter text to test..."
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="min-h-[200px]"
              />

              <div className="flex justify-between">
                <Button variant="outline" onClick={loadSampleText}>
                  Load Sample Text
                </Button>
                <Button variant="outline" onClick={() => copyToClipboard(`/${pattern}/${flags}`)} disabled={!pattern}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy Regex
                </Button>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Matches</h3>
                  <Badge variant="outline">{matches.length}</Badge>
                </div>
                {matches.length > 0 ? (
                  <div className="space-y-2">
                    <div
                      className="p-3 bg-background rounded-md text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                    />
                    <div className="text-xs text-muted-foreground">Highlighted matches in text</div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No matches found</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Saved Patterns</CardTitle>
          <CardDescription>Your library of regular expressions</CardDescription>
        </CardHeader>
        <CardContent>
          {savedPatterns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPatterns.map((savedPattern) => (
                <div key={savedPattern.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="font-medium truncate">{savedPattern.description}</div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => loadPattern(savedPattern)} className="h-7 px-2">
                        Load
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePattern(savedPattern.id)}
                        className="h-7 px-2 text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="font-mono text-sm mt-1">
                    /{savedPattern.pattern}/{savedPattern.flags}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No saved patterns yet</p>
              <p className="text-sm">Save patterns to build your regex library</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}

