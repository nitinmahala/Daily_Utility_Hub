"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileDown, Upload, ImageIcon, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Progress } from "@/components/ui/progress"

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const [quality, setQuality] = useState<number>(80)
  const [maxWidth, setMaxWidth] = useState<number>(1920)
  const [isCompressing, setIsCompressing] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.match("image.*")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setFileName(file.name)
    setFileType(file.type)
    setOriginalSize(file.size)

    const reader = new FileReader()
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string)
      setCompressedImage(null)
      setCompressedSize(0)
    }
    reader.readAsDataURL(file)
  }

  const compressImage = () => {
    if (!originalImage) return

    setIsCompressing(true)

    // Create an image element to load the original image
    const img = new Image()
    img.src = originalImage

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      // Create a canvas to draw the resized image
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      // Draw the image on the canvas
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setIsCompressing(false)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Convert canvas to compressed data URL
      const compressedDataUrl = canvas.toDataURL(fileType, quality / 100)
      setCompressedImage(compressedDataUrl)

      // Calculate compressed size
      const base64str = compressedDataUrl.split(",")[1]
      const compSize = Math.round((base64str.length * 3) / 4)
      setCompressedSize(compSize)

      setIsCompressing(false)
    }
  }

  const downloadCompressedImage = () => {
    if (!compressedImage || !fileName) return

    const link = document.createElement("a")
    link.href = compressedImage

    // Create new filename with quality indicator
    const dotIndex = fileName.lastIndexOf(".")
    const newFileName =
      dotIndex !== -1
        ? `${fileName.substring(0, dotIndex)}_compressed_${quality}${fileName.substring(dotIndex)}`
        : `${fileName}_compressed_${quality}`

    link.download = newFileName
    link.click()
  }

  const resetCompressor = () => {
    setOriginalImage(null)
    setCompressedImage(null)
    setOriginalSize(0)
    setCompressedSize(0)
    setFileName("")
    setFileType("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Format file size to KB or MB
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    if (bytes < 1024) return bytes + " Bytes"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  // Calculate compression percentage
  const compressionPercentage =
    originalSize && compressedSize ? Math.round(100 - (compressedSize / originalSize) * 100) : 0

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Image Compressor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
            <CardDescription>Upload an image to compress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-4 text-center">
              {originalImage ? (
                <div className="w-full">
                  <img
                    src={originalImage || "/placeholder.svg"}
                    alt="Original"
                    className="max-h-[300px] mx-auto object-contain rounded-md"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {fileName} ({formatFileSize(originalSize)})
                  </p>
                </div>
              ) : (
                <div className="py-8">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-2 mx-auto" />
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop an image, or click to browse</p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image
                    </label>
                  </Button>
                </div>
              )}
            </div>

            {originalImage && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quality-slider">Quality: {quality}%</Label>
                  <Slider
                    id="quality-slider"
                    min={1}
                    max={100}
                    step={1}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Lower quality = smaller file size</p>
                </div>

                <div>
                  <Label htmlFor="max-width">Max Width (px)</Label>
                  <Input
                    id="max-width"
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    min={100}
                    max={8000}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Larger dimensions = larger file size</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" onClick={resetCompressor} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button onClick={compressImage} disabled={isCompressing} className="flex-1">
                    {isCompressing ? "Compressing..." : "Compress Image"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compressed Result</CardTitle>
            <CardDescription>Preview and download your compressed image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-4 text-center min-h-[300px]">
              {isCompressing ? (
                <div className="w-full space-y-4">
                  <p className="text-sm text-muted-foreground">Compressing image...</p>
                  <Progress value={50} className="w-full" />
                </div>
              ) : compressedImage ? (
                <div className="w-full">
                  <img
                    src={compressedImage || "/placeholder.svg"}
                    alt="Compressed"
                    className="max-h-[300px] mx-auto object-contain rounded-md"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">Compressed ({formatFileSize(compressedSize)})</p>
                </div>
              ) : (
                <div className="py-8">
                  <p className="text-sm text-muted-foreground">Compressed image will appear here</p>
                </div>
              )}
            </div>

            {compressedImage && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Original:</span>
                    <span className="text-sm font-medium">{formatFileSize(originalSize)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Compressed:</span>
                    <span className="text-sm font-medium">{formatFileSize(compressedSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Reduction:</span>
                    <span className="text-sm font-medium text-green-500">{compressionPercentage}%</span>
                  </div>
                </div>

                <Button onClick={downloadCompressedImage} className="w-full">
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Compressed Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}

