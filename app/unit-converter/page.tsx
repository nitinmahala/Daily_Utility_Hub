"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight } from "lucide-react"

type UnitType = "length" | "weight" | "temperature" | "area" | "volume" | "time"

interface UnitOption {
  value: string
  label: string
  conversionFactor: number
}

interface UnitCategory {
  name: string
  units: UnitOption[]
  baseUnit: string
  specialConversion?: boolean
}

const unitCategories: Record<UnitType, UnitCategory> = {
  length: {
    name: "Length",
    baseUnit: "m",
    units: [
      { value: "km", label: "Kilometers (km)", conversionFactor: 1000 },
      { value: "m", label: "Meters (m)", conversionFactor: 1 },
      { value: "cm", label: "Centimeters (cm)", conversionFactor: 0.01 },
      { value: "mm", label: "Millimeters (mm)", conversionFactor: 0.001 },
      { value: "mi", label: "Miles (mi)", conversionFactor: 1609.34 },
      { value: "yd", label: "Yards (yd)", conversionFactor: 0.9144 },
      { value: "ft", label: "Feet (ft)", conversionFactor: 0.3048 },
      { value: "in", label: "Inches (in)", conversionFactor: 0.0254 },
    ],
  },
  weight: {
    name: "Weight",
    baseUnit: "kg",
    units: [
      { value: "t", label: "Metric Tons (t)", conversionFactor: 1000 },
      { value: "kg", label: "Kilograms (kg)", conversionFactor: 1 },
      { value: "g", label: "Grams (g)", conversionFactor: 0.001 },
      { value: "mg", label: "Milligrams (mg)", conversionFactor: 0.000001 },
      { value: "lb", label: "Pounds (lb)", conversionFactor: 0.453592 },
      { value: "oz", label: "Ounces (oz)", conversionFactor: 0.0283495 },
    ],
  },
  temperature: {
    name: "Temperature",
    baseUnit: "c",
    specialConversion: true,
    units: [
      { value: "c", label: "Celsius (°C)", conversionFactor: 1 },
      { value: "f", label: "Fahrenheit (°F)", conversionFactor: 1 },
      { value: "k", label: "Kelvin (K)", conversionFactor: 1 },
    ],
  },
  area: {
    name: "Area",
    baseUnit: "m2",
    units: [
      { value: "km2", label: "Square Kilometers (km²)", conversionFactor: 1000000 },
      { value: "m2", label: "Square Meters (m²)", conversionFactor: 1 },
      { value: "cm2", label: "Square Centimeters (cm²)", conversionFactor: 0.0001 },
      { value: "mm2", label: "Square Millimeters (mm²)", conversionFactor: 0.000001 },
      { value: "ha", label: "Hectares (ha)", conversionFactor: 10000 },
      { value: "acre", label: "Acres", conversionFactor: 4046.86 },
      { value: "ft2", label: "Square Feet (ft²)", conversionFactor: 0.092903 },
      { value: "in2", label: "Square Inches (in²)", conversionFactor: 0.00064516 },
    ],
  },
  volume: {
    name: "Volume",
    baseUnit: "l",
    units: [
      { value: "m3", label: "Cubic Meters (m³)", conversionFactor: 1000 },
      { value: "l", label: "Liters (L)", conversionFactor: 1 },
      { value: "ml", label: "Milliliters (mL)", conversionFactor: 0.001 },
      { value: "gal", label: "Gallons (US)", conversionFactor: 3.78541 },
      { value: "qt", label: "Quarts (US)", conversionFactor: 0.946353 },
      { value: "pt", label: "Pints (US)", conversionFactor: 0.473176 },
      { value: "cup", label: "Cups (US)", conversionFactor: 0.236588 },
      { value: "fl_oz", label: "Fluid Ounces (US)", conversionFactor: 0.0295735 },
      { value: "tbsp", label: "Tablespoons (US)", conversionFactor: 0.0147868 },
      { value: "tsp", label: "Teaspoons (US)", conversionFactor: 0.00492892 },
    ],
  },
  time: {
    name: "Time",
    baseUnit: "s",
    units: [
      { value: "y", label: "Years", conversionFactor: 31536000 },
      { value: "mo", label: "Months (avg)", conversionFactor: 2628000 },
      { value: "w", label: "Weeks", conversionFactor: 604800 },
      { value: "d", label: "Days", conversionFactor: 86400 },
      { value: "h", label: "Hours", conversionFactor: 3600 },
      { value: "min", label: "Minutes", conversionFactor: 60 },
      { value: "s", label: "Seconds", conversionFactor: 1 },
      { value: "ms", label: "Milliseconds", conversionFactor: 0.001 },
    ],
  },
}

export default function UnitConverter() {
  const [unitType, setUnitType] = useState<UnitType>("length")
  const [fromUnit, setFromUnit] = useState("")
  const [toUnit, setToUnit] = useState("")
  const [fromValue, setFromValue] = useState<string>("")
  const [toValue, setToValue] = useState<string>("")
  const [lastEdited, setLastEdited] = useState<"from" | "to">("from")

  // Set default units when unit type changes
  useEffect(() => {
    const category = unitCategories[unitType]
    setFromUnit(category.units[0].value)
    setToUnit(category.units[1].value)
    setFromValue("")
    setToValue("")
  }, [unitType])

  // Convert values when inputs change
  useEffect(() => {
    if (fromUnit && toUnit) {
      if (lastEdited === "from" && fromValue !== "") {
        convertValue(fromValue, fromUnit, toUnit)
      } else if (lastEdited === "to" && toValue !== "") {
        convertValue(toValue, toUnit, fromUnit)
      }
    }
  }, [fromValue, toValue, fromUnit, toUnit, lastEdited])

  const convertValue = (value: string, from: string, to: string) => {
    const numValue = Number.parseFloat(value)

    if (isNaN(numValue)) {
      if (lastEdited === "from") {
        setToValue("")
      } else {
        setFromValue("")
      }
      return
    }

    const category = unitCategories[unitType]

    // Special case for temperature
    if (category.specialConversion && unitType === "temperature") {
      let result: number

      if (from === "c" && to === "f") {
        result = (numValue * 9) / 5 + 32
      } else if (from === "c" && to === "k") {
        result = numValue + 273.15
      } else if (from === "f" && to === "c") {
        result = ((numValue - 32) * 5) / 9
      } else if (from === "f" && to === "k") {
        result = ((numValue - 32) * 5) / 9 + 273.15
      } else if (from === "k" && to === "c") {
        result = numValue - 273.15
      } else if (from === "k" && to === "f") {
        result = ((numValue - 273.15) * 9) / 5 + 32
      } else {
        result = numValue // Same unit
      }

      if (lastEdited === "from") {
        setToValue(formatResult(result))
      } else {
        setFromValue(formatResult(result))
      }
      return
    }

    // Standard conversion using factors
    const fromUnit = category.units.find((u) => u.value === from)
    const toUnit = category.units.find((u) => u.value === to)

    if (fromUnit && toUnit) {
      // Convert to base unit, then to target unit
      const valueInBaseUnit = numValue * fromUnit.conversionFactor
      const result = valueInBaseUnit / toUnit.conversionFactor

      if (lastEdited === "from") {
        setToValue(formatResult(result))
      } else {
        setFromValue(formatResult(result))
      }
    }
  }

  const formatResult = (value: number): string => {
    // Handle very small or very large numbers
    if (Math.abs(value) < 0.000001 || Math.abs(value) > 1000000) {
      return value.toExponential(6)
    }

    // For normal numbers, limit to 6 significant digits
    const precision = value >= 1 ? Math.min(6, Math.max(0, 6 - Math.floor(Math.log10(value)) - 1)) : 6

    return value.toFixed(precision).replace(/\.?0+$/, "")
  }

  const swapUnits = () => {
    const tempUnit = fromUnit
    setFromUnit(toUnit)
    setToUnit(tempUnit)

    const tempValue = fromValue
    setFromValue(toValue)
    setToValue(tempValue)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Unit Converter</h1>

      <Card>
        <CardHeader>
          <CardTitle>Convert Units</CardTitle>
          <CardDescription>Select a category and convert between different units of measurement</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={unitType} onValueChange={(value) => setUnitType(value as UnitType)} className="mb-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="length">Length</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="temperature">Temp</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="time">Time</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="from-value">Value</Label>
                <Input
                  id="from-value"
                  type="number"
                  value={fromValue}
                  onChange={(e) => {
                    setFromValue(e.target.value)
                    setLastEdited("from")
                  }}
                  placeholder="Enter value"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="from-unit">From Unit</Label>
                <Select
                  value={fromUnit}
                  onValueChange={(value) => {
                    setFromUnit(value)
                    if (fromValue) setLastEdited("from")
                  }}
                >
                  <SelectTrigger id="from-unit" className="mt-1">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitCategories[unitType].units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 relative">
              <Button
                variant="outline"
                size="icon"
                onClick={swapUnits}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              <div>
                <Label htmlFor="to-value">Result</Label>
                <Input
                  id="to-value"
                  type="number"
                  value={toValue}
                  onChange={(e) => {
                    setToValue(e.target.value)
                    setLastEdited("to")
                  }}
                  placeholder="Converted value"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="to-unit">To Unit</Label>
                <Select
                  value={toUnit}
                  onValueChange={(value) => {
                    setToUnit(value)
                    if (toValue) setLastEdited("to")
                  }}
                >
                  <SelectTrigger id="to-unit" className="mt-1">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitCategories[unitType].units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button onClick={swapUnits} className="w-full mt-6 md:hidden">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Swap Units
          </Button>

          {unitType === "temperature" && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Temperature Conversion Formulas:</h3>
              <ul className="space-y-1 text-sm">
                <li>Celsius to Fahrenheit: °F = (°C × 9/5) + 32</li>
                <li>Fahrenheit to Celsius: °C = (°F - 32) × 5/9</li>
                <li>Celsius to Kelvin: K = °C + 273.15</li>
                <li>Kelvin to Celsius: °C = K - 273.15</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

