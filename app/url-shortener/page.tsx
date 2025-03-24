"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clipboard, Trash2, ExternalLink } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface ShortenedUrl {
  id: string
  originalUrl: string
  createdAt: number
}

export default function UrlShortener() {
  const [url, setUrl] = useState("")
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedUrls = localStorage.getItem("shortenedUrls")
    if (savedUrls) {
      setShortenedUrls(JSON.parse(savedUrls))
    }
  }, [])

  const saveToLocalStorage = (urls: ShortenedUrl[]) => {
    localStorage.setItem("shortenedUrls", JSON.stringify(urls))
    setShortenedUrls(urls)
  }

  const generateShortId = () => {
    return Math.random().toString(36).substring(2, 8)
  }

  const shortenUrl = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    try {
      // Basic URL validation
      new URL(url)
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const newShortUrl: ShortenedUrl = {
        id: generateShortId(),
        originalUrl: url,
        createdAt: Date.now(),
      }

      const updatedUrls = [newShortUrl, ...shortenedUrls]
      saveToLocalStorage(updatedUrls)
      setUrl("")
      setIsLoading(false)

      toast({
        title: "URL shortened",
        description: "Your shortened URL has been created",
      })
    }, 500) // Simulate processing time
  }

  const deleteUrl = (id: string) => {
    const updatedUrls = shortenedUrls.filter((item) => item.id !== id)
    saveToLocalStorage(updatedUrls)

    toast({
      title: "URL deleted",
      description: "The shortened URL has been removed",
    })
  }

  const copyToClipboard = (id: string) => {
    const shortUrl = `${window.location.origin}/s/${id}`
    navigator.clipboard.writeText(shortUrl)

    toast({
      title: "Copied to clipboard",
      description: shortUrl,
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">URL Shortener</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Shorten a URL</CardTitle>
          <CardDescription>Enter a long URL to create a shorter, more manageable link</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={shortenUrl} disabled={isLoading}>
              {isLoading ? "Shortening..." : "Shorten URL"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Shortened URLs</CardTitle>
            <CardDescription>All URLs are stored locally in your browser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short URL</TableHead>
                    <TableHead className="hidden md:table-cell">Original URL</TableHead>
                    <TableHead className="hidden sm:table-cell">Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shortenedUrls.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {`${window.location.origin.substring(0, 20)}${window.location.origin.length > 20 ? "..." : ""}/s/${item.id}`}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">{item.originalUrl}</TableCell>
                      <TableCell className="hidden sm:table-cell">{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(item.id)}
                            title="Copy to clipboard"
                          >
                            <Clipboard className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(item.originalUrl, "_blank")}
                            title="Open original URL"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => deleteUrl(item.id)} title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Toaster />
    </div>
  )
}

