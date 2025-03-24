"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Clipboard, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RandomGenerator() {
  // Number generator state
  const [minNumber, setMinNumber] = useState(1)
  const [maxNumber, setMaxNumber] = useState(100)
  const [numberCount, setNumberCount] = useState(1)
  const [allowDuplicates, setAllowDuplicates] = useState(false)
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([])

  // String generator state
  const [stringLength, setStringLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [generatedString, setGeneratedString] = useState("")

  // UUID generator state
  const [uuidVersion, setUuidVersion] = useState<"v4" | "v1">("v4")
  const [generatedUuid, setGeneratedUuid] = useState("")

  // Copied states
  const [copiedNumbers, setCopiedNumbers] = useState(false)
  const [copiedString, setCopiedString] = useState(false)
  const [copiedUuid, setCopiedUuid] = useState(false)

  // Generate random numbers
  const generateRandomNumbers = () => {
    if (minNumber > maxNumber) {
      toast({
        title: "Invalid range",
        description: "Minimum number must be less than or equal to maximum number",
        variant: "destructive",
      })
      return
    }

    if (!allowDuplicates && maxNumber - minNumber + 1 < numberCount) {
      toast({
        title: "Invalid configuration",
        description: "Not enough unique numbers in the range for the requested count",
        variant: "destructive",
      })
      return
    }

    let result: number[] = []

    if (allowDuplicates) {
      // Generate numbers with duplicates allowed
      for (let i = 0; i < numberCount; i++) {
        const randomNum = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber
        result.push(randomNum)
      }
    } else {
      // Generate unique numbers
      const availableNumbers = Array.from({ length: maxNumber - minNumber + 1 }, (_, i) => i + minNumber)

      // Fisher-Yates shuffle
      for (let i = availableNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]]
      }

      result = availableNumbers.slice(0, numberCount)
    }

    setGeneratedNumbers(result)
  }

  // Generate random string
  const generateRandomString = () => {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "Invalid configuration",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return
    }

    let charset = ""
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    let result = ""
    for (let i = 0; i < stringLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      result += charset[randomIndex]
    }

    setGeneratedString(result)
  }

  // Generate UUID
  const generateUuid = () => {
    if (uuidVersion === "v4") {
      // Generate v4 UUID (random)
      const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
      setGeneratedUuid(uuid)
    } else {
      // Generate v1 UUID (time-based)
      // This is a simplified version that doesn't fully comply with the spec
      const now = new Date().getTime()
      const uuid = "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = ((now + Math.random() * 16) % 16) | 0
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
      })
      setGeneratedUuid(uuid)
    }
  }

  // Copy functions
  const copyToClipboard = (text: string, setCopiedState: (value: boolean) => void) => {
    navigator.clipboard.writeText(text)
    setCopiedState(true)

    toast({
      title: "Copied to clipboard",
      description: "Value has been copied to your clipboard",
    })

    setTimeout(() => setCopiedState(false), 2000)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Random Generator</h1>

      <Tabs defaultValue="numbers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="numbers">Numbers</TabsTrigger>
          <TabsTrigger value="strings">Strings</TabsTrigger>
          <TabsTrigger value="uuid">UUID</TabsTrigger>
        </TabsList>

        {/* Random Numbers */}
        <TabsContent value="numbers">
          <Card>
            <CardHeader>
              <CardTitle>Random Number Generator</CardTitle>
              <CardDescription>Generate random numbers within a specified range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-number">Minimum</Label>
                      <Input
                        id="min-number"
                        type="number"
                        value={minNumber}
                        onChange={(e) => setMinNumber(Number.parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-number">Maximum</Label>
                      <Input
                        id="max-number"
                        type="number"
                        value={maxNumber}
                        onChange={(e) => setMaxNumber(Number.parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="number-count">Count: {numberCount}</Label>
                    <Slider
                      id="number-count"
                      min={1}
                      max={100}
                      step={1}
                      value={[numberCount]}
                      onValueChange={(value) => setNumberCount(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="allow-duplicates" checked={allowDuplicates} onCheckedChange={setAllowDuplicates} />
                    <Label htmlFor="allow-duplicates">Allow duplicates</Label>
                  </div>

                  <Button onClick={generateRandomNumbers} className="w-full">
                    Generate Random Numbers
                  </Button>
                </div>

                <div>
                  <Label>Result</Label>
                  <div className="relative mt-1">
                    <div className="min-h-[150px] p-3 border rounded-md bg-muted">
                      {generatedNumbers.length > 0 ? (
                        <div className="break-all">{generatedNumbers.join(", ")}</div>
                      ) : (
                        <div className="text-muted-foreground text-center py-12">
                          Generated numbers will appear here
                        </div>
                      )}
                    </div>
                    {generatedNumbers.length > 0 && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generatedNumbers.join(", "), setCopiedNumbers)}
                      >
                        {copiedNumbers ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clipboard className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Random Strings */}
        <TabsContent value="strings">
          <Card>
            <CardHeader>
              <CardTitle>Random String Generator</CardTitle>
              <CardDescription>Generate random strings with customizable options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="string-length">Length: {stringLength}</Label>
                    <Slider
                      id="string-length"
                      min={1}
                      max={64}
                      step={1}
                      value={[stringLength]}
                      onValueChange={(value) => setStringLength(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="include-uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                      <Label htmlFor="include-uppercase">Include uppercase letters (A-Z)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="include-lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                      <Label htmlFor="include-lowercase">Include lowercase letters (a-z)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="include-numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                      <Label htmlFor="include-numbers">Include numbers (0-9)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="include-symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                      <Label htmlFor="include-symbols">Include symbols (!@#$%^&*)</Label>
                    </div>
                  </div>

                  <Button onClick={generateRandomString} className="w-full">
                    Generate Random String
                  </Button>
                </div>

                <div>
                  <Label>Result</Label>
                  <div className="relative mt-1">
                    <div className="min-h-[150px] p-3 border rounded-md bg-muted">
                      {generatedString ? (
                        <div className="break-all font-mono">{generatedString}</div>
                      ) : (
                        <div className="text-muted-foreground text-center py-12">Generated string will appear here</div>
                      )}
                    </div>
                    {generatedString && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generatedString, setCopiedString)}
                      >
                        {copiedString ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clipboard className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UUID Generator */}
        <TabsContent value="uuid">
          <Card>
            <CardHeader>
              <CardTitle>UUID Generator</CardTitle>
              <CardDescription>Generate universally unique identifiers (UUIDs)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="uuid-version">UUID Version</Label>
                    <Select value={uuidVersion} onValueChange={(value) => setUuidVersion(value as "v4" | "v1")}>
                      <SelectTrigger id="uuid-version" className="mt-1">
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v4">Version 4 (Random)</SelectItem>
                        <SelectItem value="v1">Version 1 (Time-based)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {uuidVersion === "v4"
                        ? "Version 4 UUIDs are randomly generated"
                        : "Version 1 UUIDs are generated based on timestamp"}
                    </p>
                  </div>

                  <Button onClick={generateUuid} className="w-full">
                    Generate UUID
                  </Button>
                </div>

                <div>
                  <Label>Result</Label>
                  <div className="relative mt-1">
                    <div className="min-h-[150px] p-3 border rounded-md bg-muted">
                      {generatedUuid ? (
                        <div className="break-all font-mono">{generatedUuid}</div>
                      ) : (
                        <div className="text-muted-foreground text-center py-12">Generated UUID will appear here</div>
                      )}
                    </div>
                    {generatedUuid && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generatedUuid, setCopiedUuid)}
                      >
                        {copiedUuid ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

