"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ShortUrlRedirect({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    const shortenedUrls = localStorage.getItem("shortenedUrls")

    if (shortenedUrls) {
      const urls = JSON.parse(shortenedUrls)
      const urlData = urls.find((item: any) => item.id === id)

      if (urlData) {
        window.location.href = urlData.originalUrl
      } else {
        // Redirect to home if URL not found
        router.push("/url-shortener")
      }
    } else {
      // Redirect to home if no URLs in storage
      router.push("/url-shortener")
    }
  }, [id, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <h1 className="text-xl font-medium">Redirecting...</h1>
    </div>
  )
}

