"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Bot, User, Mic, MicOff, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface AIChatbotProps {
  onBack: () => void
}

export function AIChatbot({ onBack }: AIChatbotProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; timestamp: Date }[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you with your attendance today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { userData } = useAuth()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(input, userData)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true)
      // In a real app, this would use the Web Speech API
      setTimeout(() => {
        setInput("What's my attendance in Mathematics?")
        setIsListening(false)
      }, 2000)
    } else {
      setIsListening(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Visionary AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[60vh] overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === "assistant" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900 ml-auto"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">{formatTime(message.timestamp)}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-blue-100 text-blue-900">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form
              className="flex w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
            >
              <Button
                type="button"
                size="icon"
                variant="outline"
                className={isListening ? "bg-red-100 text-red-600 border-red-200" : ""}
                onClick={handleVoiceInput}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">Suggested Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "What's my overall attendance?",
              "How many classes do I have today?",
              "Which subject has my lowest attendance?",
              "What's my attendance streak?",
              "How many more classes to reach 75% in Physics?",
              "Show me my timetable for tomorrow",
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start bg-white hover:bg-blue-50"
                onClick={() => setInput(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate AI responses
function generateResponse(input: string, userData: any): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes("overall attendance") || lowerInput.includes("attendance overall")) {
    const totalPeriods = userData?.subjects?.reduce((sum: number, subject: any) => sum + subject.total, 0) || 0
    const attendedPeriods = userData?.subjects?.reduce((sum: number, subject: any) => sum + subject.attended, 0) || 0
    const percentage = totalPeriods > 0 ? Math.round((attendedPeriods / totalPeriods) * 100) : 0
    return `Your overall attendance is ${percentage}%. You've attended ${attendedPeriods} out of ${totalPeriods} total classes.`
  }

  if (lowerInput.includes("classes today") || lowerInput.includes("today's classes")) {
    return "Today you have 3 classes: Mathematics at 9:00 AM, Physics at 11:00 AM, and Chemistry at 2:00 PM."
  }

  if (lowerInput.includes("lowest attendance")) {
    if (!userData?.subjects?.length) return "You don't have any subjects registered yet."

    let lowestSubject = userData.subjects[0]
    let lowestPercentage = (lowestSubject.attended / lowestSubject.total) * 100

    userData.subjects.forEach((subject: any) => {
      const percentage = (subject.attended / subject.total) * 100
      if (percentage < lowestPercentage) {
        lowestPercentage = percentage
        lowestSubject = subject
      }
    })

    return `Your lowest attendance is in ${lowestSubject.name} at ${Math.round(lowestPercentage)}%.`
  }

  if (lowerInput.includes("streak")) {
    return "You currently have a 7-day attendance streak. Keep it up!"
  }

  if (lowerInput.includes("physics") && lowerInput.includes("75%")) {
    const physicsSubject = userData?.subjects?.find((s: any) => s.name.toLowerCase() === "physics")
    if (!physicsSubject) return "I couldn't find Physics in your subjects."

    const currentPercentage = (physicsSubject.attended / physicsSubject.total) * 100
    if (currentPercentage >= 75) return "Good news! You've already achieved 75% attendance in Physics."

    let needed = 0
    let newAttended = physicsSubject.attended
    let newTotal = physicsSubject.total

    while ((newAttended / newTotal) * 100 < 75) {
      newAttended += 1
      newTotal += 1
      needed += 1
    }

    return `You need to attend ${needed} more Physics classes to reach 75% attendance.`
  }

  if (lowerInput.includes("timetable") && lowerInput.includes("tomorrow")) {
    return "Tomorrow's timetable includes: Computer Science at 10:00 AM, English at 1:00 PM, and Mathematics at 3:00 PM."
  }

  if (lowerInput.includes("mathematics") || lowerInput.includes("math")) {
    const mathSubject = userData?.subjects?.find((s: any) => s.name.toLowerCase().includes("math"))
    if (!mathSubject) return "I couldn't find Mathematics in your subjects."

    const percentage = Math.round((mathSubject.attended / mathSubject.total) * 100)
    return `Your attendance in Mathematics is ${percentage}%. You've attended ${mathSubject.attended} out of ${mathSubject.total} classes.`
  }

  return "I'm here to help with your attendance queries. You can ask me about your overall attendance, specific subjects, or today's classes."
}
