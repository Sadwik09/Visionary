"use client"

interface VoiceCommand {
  pattern: RegExp
  action: string
  handler: (matches: RegExpMatchArray, context: any) => Promise<string>
  description: string
}

class VoiceInterface {
  private static instance: VoiceInterface
  private recognition: any = null
  private synthesis: any = null
  private isListening = false
  private commands: VoiceCommand[] = []

  static getInstance(): VoiceInterface {
    if (!VoiceInterface.instance) {
      VoiceInterface.instance = new VoiceInterface()
    }
    return VoiceInterface.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = false
        this.recognition.interimResults = false
        this.recognition.lang = "en-US"
      }

      // Initialize Speech Synthesis
      this.synthesis = window.speechSynthesis

      this.initializeCommands()
    }
  }

  private initializeCommands() {
    this.commands = [
      {
        pattern: /what'?s my attendance (today|this week|overall)?/i,
        action: "get_attendance",
        handler: async (matches, context) => {
          const period = matches[1] || "overall"
          const attendance = this.calculateAttendance(context.userData, period)
          return `Your ${period} attendance is ${attendance}%`
        },
        description: "Get attendance information",
      },
      {
        pattern: /add (a )?period for (.*) (at|from) (\d{1,2}):?(\d{2})? ?(am|pm)?/i,
        action: "add_period",
        handler: async (matches, context) => {
          const subject = matches[2]
          const hour = Number.parseInt(matches[4])
          const minute = Number.parseInt(matches[5] || "0")
          const ampm = matches[6]

          // Convert to 24-hour format
          let time24 = hour
          if (ampm?.toLowerCase() === "pm" && hour !== 12) time24 += 12
          if (ampm?.toLowerCase() === "am" && hour === 12) time24 = 0

          const timeString = `${time24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

          return `I would add a ${subject} period at ${timeString}. This feature requires integration with your timetable system.`
        },
        description: "Add a period to timetable",
      },
      {
        pattern: /mark me (present|absent) for (.*)/i,
        action: "mark_attendance",
        handler: async (matches, context) => {
          const status = matches[1].toLowerCase()
          const subject = matches[2]
          return `I would mark you ${status} for ${subject}. This requires integration with your attendance system.`
        },
        description: "Mark attendance for a subject",
      },
      {
        pattern: /how many (classes|periods) do I need to attend for (.*)/i,
        action: "classes_needed",
        handler: async (matches, context) => {
          const subject = matches[2]
          // Mock calculation
          const needed = Math.floor(Math.random() * 10) + 1
          return `You need to attend approximately ${needed} more classes for ${subject} to reach your target attendance.`
        },
        description: "Calculate classes needed for target",
      },
      {
        pattern: /what'?s my (current )?streak/i,
        action: "get_streak",
        handler: async (matches, context) => {
          // Mock streak data
          const streak = Math.floor(Math.random() * 15) + 1
          return `Your current attendance streak is ${streak} days. Keep it up!`
        },
        description: "Get current attendance streak",
      },
      {
        pattern:
          /show me my (schedule|timetable) for (today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
        action: "show_schedule",
        handler: async (matches, context) => {
          const day = matches[2].toLowerCase()
          return `Here's your ${day} schedule. This would show your timetable for ${day}.`
        },
        description: "Show schedule for specific day",
      },
      {
        pattern: /what'?s my (worst|best) subject/i,
        action: "subject_performance",
        handler: async (matches, context) => {
          const type = matches[1].toLowerCase()
          if (!context.userData?.subjects?.length) {
            return "I don't have enough data about your subjects yet."
          }

          const subjects = context.userData.subjects.map((s: any) => ({
            name: s.name,
            percentage: (s.attended / s.total) * 100,
          }))

          const subject =
            type === "worst"
              ? subjects.reduce((min, s) => (s.percentage < min.percentage ? s : min))
              : subjects.reduce((max, s) => (s.percentage > max.percentage ? s : max))

          return `Your ${type} performing subject is ${subject.name} with ${Math.round(subject.percentage)}% attendance.`
        },
        description: "Get best or worst performing subject",
      },
      {
        pattern: /set my target (attendance )?to (\d+) ?percent/i,
        action: "set_target",
        handler: async (matches, context) => {
          const target = Number.parseInt(matches[2])
          return `I would set your target attendance to ${target}%. This requires integration with your settings.`
        },
        description: "Set attendance target",
      },
      {
        pattern: /(help|what can you do)/i,
        action: "help",
        handler: async (matches, context) => {
          const commandList = this.commands
            .filter((cmd) => cmd.action !== "help")
            .map((cmd) => `• ${cmd.description}`)
            .join("\n")

          return `I can help you with:\n${commandList}\n\nJust speak naturally and I'll understand!`
        },
        description: "Show available commands",
      },
    ]
  }

  private calculateAttendance(userData: any, period: string): number {
    if (!userData?.subjects?.length) return 0

    const totalPeriods = userData.subjects.reduce((sum: number, s: any) => sum + s.total, 0)
    const attendedPeriods = userData.subjects.reduce((sum: number, s: any) => sum + s.attended, 0)

    const overall = totalPeriods > 0 ? Math.round((attendedPeriods / totalPeriods) * 100) : 0

    // For demo purposes, return variations based on period
    switch (period) {
      case "today":
        return Math.min(100, overall + Math.floor(Math.random() * 10))
      case "this week":
        return Math.min(100, overall + Math.floor(Math.random() * 5))
      default:
        return overall
    }
  }

  startListening(context: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error("Speech recognition not supported"))
        return
      }

      if (this.isListening) {
        reject(new Error("Already listening"))
        return
      }

      this.isListening = true

      this.recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim()
        console.log("Voice input:", transcript)

        try {
          const response = await this.processCommand(transcript, context)
          resolve(response)
        } catch (error) {
          reject(error)
        } finally {
          this.isListening = false
        }
      }

      this.recognition.onerror = (event: any) => {
        this.isListening = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
      }

      this.recognition.start()
    })
  }

  private async processCommand(transcript: string, context: any): Promise<string> {
    for (const command of this.commands) {
      const matches = transcript.match(command.pattern)
      if (matches) {
        try {
          return await command.handler(matches, context)
        } catch (error) {
          return "Sorry, I encountered an error processing that command."
        }
      }
    }

    return "I didn't understand that command. Try saying 'help' to see what I can do."
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("Speech synthesis not supported"))
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`))

      this.synthesis.speak(utterance)
    })
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis)
  }

  getAvailableCommands(): string[] {
    return this.commands.map((cmd) => cmd.description)
  }
}

export const voiceInterface = VoiceInterface.getInstance()
