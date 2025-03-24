"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, Clock, Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface TimeZoneInfo {
  id: string
  name: string
  offset: number
  abbreviation: string
}

interface TimeComparison {
  id: string
  sourceId: string
  targetId: string
  sourceTime: string
  targetTime: string
}

// List of common time zones
const timeZones: TimeZoneInfo[] = [
  { id: "utc", name: "UTC", offset: 0, abbreviation: "UTC" },
  { id: "est", name: "Eastern Time (US & Canada)", offset: -5, abbreviation: "EST" },
  { id: "cst", name: "Central Time (US & Canada)", offset: -6, abbreviation: "CST" },
  { id: "mst", name: "Mountain Time (US & Canada)", offset: -7, abbreviation: "MST" },
  { id: "pst", name: "Pacific Time (US & Canada)", offset: -8, abbreviation: "PST" },
  { id: "gmt", name: "London", offset: 0, abbreviation: "GMT" },
  { id: "cet", name: "Paris, Berlin, Rome", offset: 1, abbreviation: "CET" },
  { id: "eet", name: "Helsinki, Athens", offset: 2, abbreviation: "EET" },
  { id: "ist", name: "New Delhi", offset: 5.5, abbreviation: "IST" },
  { id: "cst_china", name: "Beijing, Shanghai", offset: 8, abbreviation: "CST" },
  { id: "jst", name: "Tokyo", offset: 9, abbreviation: "JST" },
  { id: "aest", name: "Sydney, Melbourne", offset: 10, abbreviation: "AEST" },
  { id: "nzst", name: "Auckland", offset: 12, abbreviation: "NZST" },
]

export default function TimeZoneConverter() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sourceZone, setSourceZone] = useState("utc")
  const [targetZone, setTargetZone] = useState("est")
  const [sourceTime, setSourceTime] = useState("")
  const [targetTime, setTargetTime] = useState("")
  const [comparisons, setComparisons] = useState<TimeComparison[]>([])

  // Initialize source time with current time
  useEffect(() => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    setSourceTime(`${hours}:${minutes}`)

    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Convert time when source time, source zone, or target zone changes
  useEffect(() => {
    if (sourceTime) {
      convertTime()
    }
  }, [sourceTime, sourceZone, targetZone])

  const convertTime = () => {
    try {
      // Parse source time
      const [hours, minutes] = sourceTime.split(":").map(Number)
      if (isNaN(hours) || isNaN(minutes)) {
        setTargetTime("")
        return
      }

      // Get time zone offsets
      const sourceOffset = timeZones.find((tz) => tz.id === sourceZone)?.offset || 0
      const targetOffset = timeZones.find((tz) => tz.id === targetZone)?.offset || 0

      // Calculate time difference
      const offsetDiff = targetOffset - sourceOffset

      // Create a date object for the calculation
      const date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)

      // Add the offset difference in milliseconds
      date.setTime(date.getTime() + offsetDiff * 60 * 60 * 1000)

      // Format the result
      const resultHours = date.getHours().toString().padStart(2, "0")
      const resultMinutes = date.getMinutes().toString().padStart(2, "0")

      setTargetTime(`${resultHours}:${resultMinutes}`)
    } catch (error) {
      setTargetTime("")
      toast({
        title: "Conversion Error",
        description: "Please enter a valid time in HH:MM format",
        variant: "destructive",
      })
    }
  }

  const swapTimeZones = () => {
    const temp = sourceZone
    setSourceZone(targetZone)
    setTargetZone(temp)

    // Also swap the times
    const tempTime = sourceTime
    setSourceTime(targetTime)
    setTargetTime(tempTime)
  }

  const saveComparison = () => {
    if (!sourceTime || !targetTime) {
      toast({
        title: "Missing Information",
        description: "Please enter a valid time to save the comparison",
        variant: "destructive",
      })
      return
    }

    const newComparison: TimeComparison = {
      id: Date.now().toString(),
      sourceId: sourceZone,
      targetId: targetZone,
      sourceTime,
      targetTime,
    }

    setComparisons([...comparisons, newComparison])

    toast({
      title: "Comparison Saved",
      description: "Time comparison has been added to your list",
    })
  }

  const deleteComparison = (id: string) => {
    setComparisons(comparisons.filter((comp) => comp.id !== id))
  }

  const formatCurrentTime = (timeZoneId: string) => {
    const offset = timeZones.find((tz) => tz.id === timeZoneId)?.offset || 0

    // Get UTC time
    const utcTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000)

    // Apply the time zone offset
    const localTime = new Date(utcTime.getTime() + offset * 60 * 60 * 1000)

    // Format the time
    return localTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Time Zone Converter</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Convert Time Zones</CardTitle>
            <CardDescription>Compare times between different time zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source-zone">Source Time Zone</Label>
                    <Select value={sourceZone} onValueChange={setSourceZone}>
                      <SelectTrigger id="source-zone" className="mt-1">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeZones.map((tz) => (
                          <SelectItem key={tz.id} value={tz.id}>
                            {tz.name} ({tz.abbreviation}, UTC{tz.offset >= 0 ? "+" : ""}
                            {tz.offset})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground mt-1">
                      Current time: {formatCurrentTime(sourceZone)}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="source-time">Time</Label>
                    <Input
                      id="source-time"
                      type="time"
                      value={sourceTime}
                      onChange={(e) => setSourceTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" size="icon" onClick={swapTimeZones}>
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-zone">Target Time Zone</Label>
                    <Select value={targetZone} onValueChange={setTargetZone}>
                      <SelectTrigger id="target-zone" className="mt-1">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeZones.map((tz) => (
                          <SelectItem key={tz.id} value={tz.id}>
                            {tz.name} ({tz.abbreviation}, UTC{tz.offset >= 0 ? "+" : ""}
                            {tz.offset})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground mt-1">
                      Current time: {formatCurrentTime(targetZone)}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="target-time">Converted Time</Label>
                    <Input id="target-time" type="time" value={targetTime} readOnly className="mt-1 bg-muted" />
                  </div>
                </div>

                <Button onClick={saveComparison} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Save This Comparison
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Comparisons</CardTitle>
            <CardDescription>Your saved time zone comparisons</CardDescription>
          </CardHeader>
          <CardContent>
            {comparisons.length > 0 ? (
              <div className="space-y-4">
                {comparisons.map((comp) => {
                  const sourceInfo = timeZones.find((tz) => tz.id === comp.sourceId)
                  const targetInfo = timeZones.find((tz) => tz.id === comp.targetId)

                  return (
                    <div key={comp.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{comp.sourceTime}</span>
                          <span className="text-sm text-muted-foreground ml-2">{sourceInfo?.abbreviation}</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">{sourceInfo?.name}</div>
                      </div>

                      <div className="text-center text-muted-foreground">=</div>

                      <div className="text-right">
                        <div className="flex items-center justify-end">
                          <span className="font-medium">{comp.targetTime}</span>
                          <span className="text-sm text-muted-foreground ml-2">{targetInfo?.abbreviation}</span>
                          <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground mr-6">{targetInfo?.name}</div>
                      </div>

                      <Button variant="ghost" size="icon" onClick={() => deleteComparison(comp.id)} className="ml-2">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No saved comparisons yet</p>
                <p className="text-sm">Convert a time and click "Save This Comparison"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>World Clock</CardTitle>
          <CardDescription>Current time in major cities around the world</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {timeZones.map((tz) => (
              <div key={tz.id} className="p-3 border rounded-md">
                <div className="text-sm font-medium">{tz.name}</div>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-mono">{formatCurrentTime(tz.id)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {tz.abbreviation} (UTC{tz.offset >= 0 ? "+" : ""}
                  {tz.offset})
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}

