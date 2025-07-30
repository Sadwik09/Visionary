"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, MicOff, Volume2, MessageCircle, HelpCircle } from "lucide-react"
import { voiceInterface } from "@/lib/voice-interface"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface Conversation {
  id: string
  timestamp: number
  userInput: string
  assistantResponse: string
  type: "voice" | "text"
}

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [textInput, setTextInput] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { userData } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    setIsSupported(voiceInterface.isSupported())
    loadConversations()
  }, [])

  const loadConversations = () => {
    const stored = localStorage.getItem("voice_conversations")
    if (stored) {
      setConversations(JSON.parse(stored))
    }
  }

  const saveConversation = (conversation: Conversation) => {
    const updated = [conversation, ...conversations].slice(0, 50) // Keep last 50
    setConversations(updated)
    localStorage.setItem("voice_conversations", JSON.stringify(updated))
  }

  const handleVoiceInput = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser",
        variant: "destructive",
      })
      return
    }

    setIsListening(true)

    try {
      const response = await voiceInterface.startListening({ userData })

      const conversation: Conversation = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        userInput: "Voice command", // In real app, this would be the transcript
        assistantResponse: response,
        type: "voice",
      }

      saveConversation(conversation)

      // Speak the response
      setIsSpeaking(true)
      await voiceInterface.speak(response)
      setIsSpeaking(false)

      toast({
        title: "Voice Command Processed",
        description: "Check the conversation history for details",
      })
    } catch (error) {
      toast({
        title: "Voice Error",
        description: error instanceof Error ? error.message : "Voice recognition failed",
        variant: "destructive",
      })
    } finally {
      setIsListening(false)
    }
  }

  const handleTextInput = async () => {
    if (!textInput.trim()) return

    try {
      // Process text command (simulate voice processing)
      const response =
        (await voiceInterface.processCommand?.(textInput, { userData })) || "Text processing would be implemented here"

      const conversation: Conversation = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        userInput: textInput,
        assistantResponse: response,
        type: "text",
      }

      saveConversation(conversation)
      setTextInput("")

      toast({
        title: "Command Processed",
        description: "Response added to conversation history",
      })
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process your command",
        variant: "destructive",
      })
    }
  }

  const stopVoice = () => {
    voiceInterface.stopListening()
    voiceInterface.stopSpeaking()
    setIsListening(false)
    setIsSpeaking(false)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <>
      {/* Floating Voice Button */}
      <Button
        className={`fixed bottom-20 right-6 rounded-full w-14 h-14 shadow-lg z-50 ${
          isListening
            ? "bg-red-600 hover:bg-red-700 animate-pulse"
            : isSpeaking
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
        }`}
        size="icon"
        onClick={isListening || isSpeaking ? stopVoice : handleVoiceInput}
        disabled={!isSupported}
      >
        {isListening ? (
          <MicOff className="w-6 h-6" />
        ) : isSpeaking ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </Button>

      {/* Voice Assistant Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-36 right-6 rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-700 shadow-lg z-50"
            size="icon"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-green-600" />
              Voice Assistant
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4">
            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant={isSupported ? "default" : "destructive"}>
                  {isSupported ? "Ready" : "Not Supported"}
                </Badge>
                {isListening && <Badge variant="destructive">Listening...</Badge>}
                {isSpeaking && <Badge variant="secondary">Speaking...</Badge>}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isListening ? "destructive" : "default"}
                  onClick={isListening ? stopVoice : handleVoiceInput}
                  disabled={!isSupported}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Voice Commands</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground mb-4">Here are some things you can say:</p>
                      <div className="space-y-2 text-sm">
                        <div>• "What's my attendance today?"</div>
                        <div>• "Add a period for Math at 9 AM"</div>
                        <div>• "Mark me present for Physics"</div>
                        <div>• "What's my current streak?"</div>
                        <div>• "Show me my schedule for tomorrow"</div>
                        <div>• "What's my worst subject?"</div>
                        <div>• "Set my target to 85 percent"</div>
                        <div>• "Help" - to see all commands</div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Text Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or type your command here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTextInput()}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button onClick={handleTextInput} disabled={!textInput.trim()}>
                Send
              </Button>
            </div>

            {/* Conversation History */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg">Conversation History</CardTitle>
                <CardDescription>Your recent interactions with the voice assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {conversations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No conversations yet. Try using voice commands!</p>
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <div key={conv.id} className="space-y-2">
                          <div className="flex justify-end">
                            <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 max-w-[80%]">
                              <div className="flex items-center gap-2 mb-1">
                                {conv.type === "voice" ? (
                                  <Mic className="w-3 h-3" />
                                ) : (
                                  <MessageCircle className="w-3 h-3" />
                                )}
                                <span className="text-xs opacity-70">{formatTimestamp(conv.timestamp)}</span>
                              </div>
                              <p className="text-sm">{conv.userInput}</p>
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg px-3 py-2 max-w-[80%]">
                              <div className="flex items-center gap-2 mb-1">
                                <Volume2 className="w-3 h-3" />
                                <span className="text-xs text-muted-foreground">Assistant</span>
                              </div>
                              <p className="text-sm">{conv.assistantResponse}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
