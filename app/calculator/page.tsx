"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState<number | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(true)
  const [pendingOperator, setPendingOperator] = useState<string | null>(null)
  const [calculationHistory, setCalculationHistory] = useState<string[]>([])
  const [calculatorType, setCalculatorType] = useState<"basic" | "scientific">("basic")
  const [firstOperand, setFirstOperand] = useState<number>(0)

  const calculate = (rightOperand: number, pendingOperator: string): number => {
    let newResult = 0

    switch (pendingOperator) {
      case "+":
        newResult = firstOperand + rightOperand
        break
      case "-":
        newResult = firstOperand - rightOperand
        break
      case "×":
        newResult = firstOperand * rightOperand
        break
      case "÷":
        if (rightOperand === 0) {
          return 0 // Avoid division by zero
        }
        newResult = firstOperand / rightOperand
        break
      case "^":
        newResult = Math.pow(firstOperand, rightOperand)
        break
    }

    return newResult
  }

  const digitPressed = (digit: string) => {
    let newDisplay = display

    if ((display === "0" && digit === "0") || display.length > 12) {
      return
    }

    if (waitingForOperand) {
      newDisplay = digit
      setWaitingForOperand(false)
    } else {
      newDisplay = display === "0" ? digit : display + digit
    }

    setDisplay(newDisplay)
  }

  const pointPressed = () => {
    let newDisplay = display

    if (waitingForOperand) {
      newDisplay = "0."
    } else if (display.indexOf(".") === -1) {
      newDisplay = display + "."
    } else {
      return
    }

    setDisplay(newDisplay)
    setWaitingForOperand(false)
  }

  const operatorPressed = (operator: string) => {
    const operand = Number(display)

    if (pendingOperator !== null && !waitingForOperand) {
      const result = calculate(operand, pendingOperator)
      setDisplay(String(result))
      setFirstOperand(result)

      // Add to history
      const newHistory = [...calculationHistory]
      newHistory.push(`${firstOperand} ${pendingOperator} ${operand} = ${result}`)
      if (newHistory.length > 10) newHistory.shift()
      setCalculationHistory(newHistory)
    } else {
      setFirstOperand(operand)
    }

    setPendingOperator(operator)
    setWaitingForOperand(true)
  }

  const equalsPressed = () => {
    const operand = Number(display)

    if (pendingOperator !== null && !waitingForOperand) {
      const result = calculate(operand, pendingOperator)
      setDisplay(String(result))

      // Add to history
      const newHistory = [...calculationHistory]
      newHistory.push(`${firstOperand} ${pendingOperator} ${operand} = ${result}`)
      if (newHistory.length > 10) newHistory.shift()
      setCalculationHistory(newHistory)

      setFirstOperand(result)
      setPendingOperator(null)
    }

    setWaitingForOperand(true)
  }

  const clearAll = () => {
    setDisplay("0")
    setWaitingForOperand(true)
    setFirstOperand(0)
    setPendingOperator(null)
  }

  const clearDisplay = () => {
    setDisplay("0")
    setWaitingForOperand(true)
  }

  const backspace = () => {
    if (!waitingForOperand) {
      if (display.length > 1) {
        setDisplay(display.substring(0, display.length - 1))
      } else {
        setDisplay("0")
        setWaitingForOperand(true)
      }
    }
  }

  const changeSign = () => {
    const value = Number(display)
    if (value !== 0) {
      setDisplay(String(-value))
    }
  }

  const memoryAdd = () => {
    setMemory((memory || 0) + Number(display))
  }

  const memorySubtract = () => {
    setMemory((memory || 0) - Number(display))
  }

  const memoryRecall = () => {
    if (memory !== null) {
      setDisplay(String(memory))
      setWaitingForOperand(false)
    }
  }

  const memoryClear = () => {
    setMemory(null)
  }

  // Scientific calculator functions
  const scientificFunction = (func: string) => {
    const value = Number(display)
    let result = 0

    switch (func) {
      case "sin":
        result = Math.sin(value)
        break
      case "cos":
        result = Math.cos(value)
        break
      case "tan":
        result = Math.tan(value)
        break
      case "log":
        result = Math.log10(value)
        break
      case "ln":
        result = Math.log(value)
        break
      case "sqrt":
        result = Math.sqrt(value)
        break
      case "square":
        result = value * value
        break
      case "pi":
        result = Math.PI
        break
      case "e":
        result = Math.E
        break
      default:
        result = value
    }

    setDisplay(String(result))
    setWaitingForOperand(true)

    // Add to history
    const newHistory = [...calculationHistory]
    newHistory.push(`${func}(${value}) = ${result}`)
    if (newHistory.length > 10) newHistory.shift()
    setCalculationHistory(newHistory)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Calculator</h1>

      <Tabs value={calculatorType} onValueChange={(value) => setCalculatorType(value as "basic" | "scientific")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="scientific">Scientific</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calculator</CardTitle>
                <CardDescription>
                  {calculatorType === "basic"
                    ? "Perform basic arithmetic calculations"
                    : "Advanced scientific calculator with trigonometric functions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-muted rounded-md font-mono text-right text-2xl h-16 flex items-center justify-end overflow-hidden">
                  {display}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {/* Memory functions */}
                  <Button variant="outline" onClick={memoryClear}>
                    MC
                  </Button>
                  <Button variant="outline" onClick={memoryRecall}>
                    MR
                  </Button>
                  <Button variant="outline" onClick={memoryAdd}>
                    M+
                  </Button>
                  <Button variant="outline" onClick={memorySubtract}>
                    M-
                  </Button>

                  {/* Clear functions */}
                  <Button variant="secondary" onClick={clearAll}>
                    C
                  </Button>
                  <Button variant="secondary" onClick={clearDisplay}>
                    CE
                  </Button>
                  <Button variant="secondary" onClick={backspace}>
                    ⌫
                  </Button>
                  <Button variant="secondary" onClick={() => operatorPressed("÷")}>
                    ÷
                  </Button>

                  {/* Numbers and operations */}
                  <Button onClick={() => digitPressed("7")}>7</Button>
                  <Button onClick={() => digitPressed("8")}>8</Button>
                  <Button onClick={() => digitPressed("9")}>9</Button>
                  <Button variant="secondary" onClick={() => operatorPressed("×")}>
                    ×
                  </Button>

                  <Button onClick={() => digitPressed("4")}>4</Button>
                  <Button onClick={() => digitPressed("5")}>5</Button>
                  <Button onClick={() => digitPressed("6")}>6</Button>
                  <Button variant="secondary" onClick={() => operatorPressed("-")}>
                    -
                  </Button>

                  <Button onClick={() => digitPressed("1")}>1</Button>
                  <Button onClick={() => digitPressed("2")}>2</Button>
                  <Button onClick={() => digitPressed("3")}>3</Button>
                  <Button variant="secondary" onClick={() => operatorPressed("+")}>
                    +
                  </Button>

                  <Button onClick={changeSign}>±</Button>
                  <Button onClick={() => digitPressed("0")}>0</Button>
                  <Button onClick={pointPressed}>.</Button>
                  <Button variant="default" onClick={equalsPressed}>
                    =
                  </Button>
                </div>

                {calculatorType === "scientific" && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <Button variant="outline" onClick={() => scientificFunction("sin")}>
                      sin
                    </Button>
                    <Button variant="outline" onClick={() => scientificFunction("cos")}>
                      cos
                    </Button>
                    <Button variant="outline" onClick={() => scientificFunction("tan")}>
                      tan
                    </Button>
                    <Button variant="outline" onClick={() => operatorPressed("^")}>
                      x^y
                    </Button>

                    <Button variant="outline" onClick={() => scientificFunction("log")}>
                      log
                    </Button>
                    <Button variant="outline" onClick={() => scientificFunction("ln")}>
                      ln
                    </Button>
                    <Button variant="outline" onClick={() => scientificFunction("sqrt")}>
                      √
                    </Button>
                    <Button variant="outline" onClick={() => scientificFunction("square")}>
                      x²
                    </Button>

                    <Button variant="outline" onClick={() => scientificFunction("pi")}>
                      π
                    </Button>
                    <Button variant="outline" onClick={() => scientificFunction("e")}>
                      e
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      AC
                    </Button>
                    <Button variant="outline" onClick={clearDisplay}>
                      C
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>History</CardTitle>
                <CardDescription>Recent calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] overflow-auto">
                  {calculationHistory.length > 0 ? (
                    <div className="space-y-2">
                      {calculationHistory.map((calculation, index) => (
                        <div key={index} className="p-2 border-b text-sm font-mono">
                          {calculation}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">No calculations yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

