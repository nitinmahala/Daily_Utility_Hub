"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Clipboard, RefreshCw, Check, Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    generatePassword()
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols])

  useEffect(() => {
    calculateStrength()
  }, [password, length, useUppercase, useLowercase, useNumbers, useSymbols])

  const generatePassword = () => {
    let charset = ""
    if (useLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (useUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (useNumbers) charset += "0123456789"
    if (useSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-="

    // Ensure at least one character set is selected
    if (charset === "") {
      setUseLowercase(true)
      charset = "abcdefghijklmnopqrstuvwxyz"
    }

    let newPassword = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }

    setPassword(newPassword)
    setCopied(false)
  }

  const calculateStrength = () => {
    let score = 0

    // Length contribution (up to 4 points)
    if (length > 4) score += 1
    if (length >= 8) score += 1
    if (length >= 12) score += 1
    if (length >= 16) score += 1

    // Character set contribution (up to 4 points)
    if (useLowercase) score += 1
    if (useUppercase) score += 1
    if (useNumbers) score += 1
    if (useSymbols) score += 1

    setStrength(score)
  }

  const getStrengthLabel = () => {
    if (strength <= 2) return "Weak"
    if (strength <= 5) return "Medium"
    if (strength <= 7) return "Strong"
    return "Very Strong"
  }

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500"
    if (strength <= 5) return "bg-yellow-500"
    if (strength <= 7) return "bg-green-500"
    return "bg-green-600"
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    toast({
      title: "Password copied",
      description: "Password has been copied to your clipboard",
    })

    // Reset copied status after 2 seconds
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Password Generator</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generated Password</CardTitle>
          <CardDescription>Your secure random password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              readOnly
              className="pr-20 font-mono text-lg"
            />
            <div className="absolute right-2 top-2 flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="h-8 w-8">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between mb-1 text-sm">
              <span>Strength: {getStrengthLabel()}</span>
              <span>{strength}/8</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getStrengthColor()}`}
                style={{ width: `${(strength / 8) * 100}%` }}
              ></div>
            </div>
          </div>

          <Button onClick={generatePassword} className="w-full mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Options</CardTitle>
          <CardDescription>Customize your password settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="length">Password Length: {length}</Label>
            </div>
            <Slider
              id="length"
              min={4}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>4</span>
              <span>12</span>
              <span>20</span>
              <span>32</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase" className="cursor-pointer">
                Include Uppercase Letters (A-Z)
              </Label>
              <Switch id="uppercase" checked={useUppercase} onCheckedChange={setUseUppercase} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase" className="cursor-pointer">
                Include Lowercase Letters (a-z)
              </Label>
              <Switch id="lowercase" checked={useLowercase} onCheckedChange={setUseLowercase} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="numbers" className="cursor-pointer">
                Include Numbers (0-9)
              </Label>
              <Switch id="numbers" checked={useNumbers} onCheckedChange={setUseNumbers} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="symbols" className="cursor-pointer">
                Include Symbols (!@#$%^&*)
              </Label>
              <Switch id="symbols" checked={useSymbols} onCheckedChange={setUseSymbols} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}

