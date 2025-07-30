"use client"

export interface AITheme {
  id: string
  name: string
  description: string
  mood: "energetic" | "focused" | "calm" | "cozy" | "celebratory" | "urgent"
  timeOfDay: "morning" | "afternoon" | "evening" | "night" | "any"
  attendanceRange: [number, number]
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    accent: string
    muted: string
    border: string
  }
  effects: {
    animations: boolean
    gradients: boolean
    glows: boolean
    shadows: boolean
  }
}

export const AI_THEMES: AITheme[] = [
  {
    id: "morning-energy",
    name: "Morning Energy",
    description: "Bright and energetic theme to start your day with motivation",
    mood: "energetic",
    timeOfDay: "morning",
    attendanceRange: [80, 100],
    colors: {
      primary: "#FF8C00",
      secondary: "#FFD700",
      background: "#FFFAF0",
      foreground: "#8B4513",
      accent: "#FFA500",
      muted: "#F5DEB3",
      border: "#DEB887",
    },
    effects: {
      animations: true,
      gradients: true,
      glows: true,
      shadows: true,
    },
  },
  {
    id: "afternoon-focus",
    name: "Afternoon Focus",
    description: "Clean and focused theme for productive afternoon sessions",
    mood: "focused",
    timeOfDay: "afternoon",
    attendanceRange: [70, 90],
    colors: {
      primary: "#3B82F6",
      secondary: "#E0E7FF",
      background: "#F8FAFC",
      foreground: "#1E293B",
      accent: "#60A5FA",
      muted: "#F1F5F9",
      border: "#CBD5E1",
    },
    effects: {
      animations: false,
      gradients: false,
      glows: false,
      shadows: true,
    },
  },
  {
    id: "evening-calm",
    name: "Evening Calm",
    description: "Soothing purple theme for peaceful evening study sessions",
    mood: "calm",
    timeOfDay: "evening",
    attendanceRange: [60, 85],
    colors: {
      primary: "#8B5CF6",
      secondary: "#EDE9FE",
      background: "#FAF5FF",
      foreground: "#581C87",
      accent: "#A78BFA",
      muted: "#F3E8FF",
      border: "#D8B4FE",
    },
    effects: {
      animations: true,
      gradients: true,
      glows: false,
      shadows: true,
    },
  },
  {
    id: "night-rest",
    name: "Night Rest",
    description: "Dark theme with blue accents for comfortable night usage",
    mood: "cozy",
    timeOfDay: "night",
    attendanceRange: [50, 80],
    colors: {
      primary: "#60A5FA",
      secondary: "#1E293B",
      background: "#0F172A",
      foreground: "#F1F5F9",
      accent: "#3B82F6",
      muted: "#334155",
      border: "#475569",
    },
    effects: {
      animations: false,
      gradients: true,
      glows: true,
      shadows: true,
    },
  },
  {
    id: "success-celebration",
    name: "Success Celebration",
    description: "Vibrant green theme to celebrate your attendance achievements",
    mood: "celebratory",
    timeOfDay: "any",
    attendanceRange: [90, 100],
    colors: {
      primary: "#10B981",
      secondary: "#D1FAE5",
      background: "#F0FDF4",
      foreground: "#064E3B",
      accent: "#34D399",
      muted: "#ECFDF5",
      border: "#A7F3D0",
    },
    effects: {
      animations: true,
      gradients: true,
      glows: true,
      shadows: true,
    },
  },
  {
    id: "warning-alert",
    name: "Warning Alert",
    description: "Urgent red theme to motivate improvement in low attendance",
    mood: "urgent",
    timeOfDay: "any",
    attendanceRange: [0, 60],
    colors: {
      primary: "#EF4444",
      secondary: "#FEE2E2",
      background: "#FEF2F2",
      foreground: "#7F1D1D",
      accent: "#F87171",
      muted: "#FEE2E2",
      border: "#FECACA",
    },
    effects: {
      animations: true,
      gradients: true,
      glows: true,
      shadows: true,
    },
  },
]

class AIThemeEngine {
  private currentTheme: AITheme | null = null
  private autoMode = true
  private listeners: ((theme: AITheme) => void)[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSettings()
      this.updateTheme()
    }
  }

  private loadSettings() {
    try {
      const savedTheme = localStorage.getItem("ai-theme-current")
      const savedAutoMode = localStorage.getItem("ai-theme-auto-mode")

      if (savedTheme) {
        this.currentTheme = AI_THEMES.find((t) => t.id === savedTheme) || null
      }

      if (savedAutoMode !== null) {
        this.autoMode = savedAutoMode === "true"
      }
    } catch (error) {
      console.warn("Failed to load theme settings:", error)
    }
  }

  private saveSettings() {
    try {
      if (this.currentTheme) {
        localStorage.setItem("ai-theme-current", this.currentTheme.id)
      }
      localStorage.setItem("ai-theme-auto-mode", this.autoMode.toString())
    } catch (error) {
      console.warn("Failed to save theme settings:", error)
    }
  }

  private applyTheme(theme: AITheme) {
    if (typeof document === "undefined") return

    try {
      // Remove existing theme classes
      document.body.className = document.body.className
        .split(" ")
        .filter((cls) => !cls.startsWith("theme-"))
        .join(" ")

      // Add new theme class
      document.body.classList.add(`theme-${theme.id}`)
      document.body.classList.add("theme-transition")

      // Apply CSS custom properties
      const root = document.documentElement
      root.style.setProperty("--theme-primary", theme.colors.primary)
      root.style.setProperty("--theme-secondary", theme.colors.secondary)
      root.style.setProperty("--theme-background", theme.colors.background)
      root.style.setProperty("--theme-foreground", theme.colors.foreground)
      root.style.setProperty("--theme-accent", theme.colors.accent)
      root.style.setProperty("--theme-muted", theme.colors.muted)
      root.style.setProperty("--theme-border", theme.colors.border)

      this.currentTheme = theme
      this.saveSettings()
      this.notifyListeners(theme)

      console.log(`Applied AI theme: ${theme.name}`)
    } catch (error) {
      console.error("Failed to apply theme:", error)
    }
  }

  private notifyListeners(theme: AITheme) {
    this.listeners.forEach((listener) => {
      try {
        listener(theme)
      } catch (error) {
        console.error("Theme listener error:", error)
      }
    })
  }

  private getCurrentHour(): number {
    return new Date().getHours()
  }

  private getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
    const hour = this.getCurrentHour()
    if (hour >= 6 && hour < 12) return "morning"
    if (hour >= 12 && hour < 17) return "afternoon"
    if (hour >= 17 && hour < 21) return "evening"
    return "night"
  }

  private calculateAttendancePercentage(): number {
    try {
      const userData = localStorage.getItem("userData")
      if (!userData) return 75

      const data = JSON.parse(userData)
      if (!data.subjects || data.subjects.length === 0) return 75

      const totalPeriods = data.subjects.reduce((sum: number, subject: any) => sum + subject.total, 0)
      const attendedPeriods = data.subjects.reduce((sum: number, subject: any) => sum + subject.attended, 0)

      return totalPeriods > 0 ? Math.round((attendedPeriods / totalPeriods) * 100) : 75
    } catch (error) {
      console.warn("Failed to calculate attendance:", error)
      return 75
    }
  }

  private selectBestTheme(): AITheme {
    const attendancePercentage = this.calculateAttendancePercentage()
    const timeOfDay = this.getTimeOfDay()

    // Filter themes by attendance range
    let suitableThemes = AI_THEMES.filter(
      (theme) => attendancePercentage >= theme.attendanceRange[0] && attendancePercentage <= theme.attendanceRange[1],
    )

    // If no themes match attendance, use all themes
    if (suitableThemes.length === 0) {
      suitableThemes = AI_THEMES
    }

    // Prefer themes matching time of day
    const timeMatchingThemes = suitableThemes.filter(
      (theme) => theme.timeOfDay === timeOfDay || theme.timeOfDay === "any",
    )

    if (timeMatchingThemes.length > 0) {
      return timeMatchingThemes[0]
    }

    return suitableThemes[0]
  }

  public updateTheme() {
    if (!this.autoMode) return

    try {
      const bestTheme = this.selectBestTheme()
      if (bestTheme.id !== this.currentTheme?.id) {
        this.applyTheme(bestTheme)
      }
    } catch (error) {
      console.error("Failed to update theme:", error)
    }
  }

  public selectTheme(themeId: string) {
    const theme = AI_THEMES.find((t) => t.id === themeId)
    if (theme) {
      this.applyTheme(theme)
    }
  }

  public setAutoMode(enabled: boolean) {
    this.autoMode = enabled
    this.saveSettings()
    if (enabled) {
      this.updateTheme()
    }
  }

  public getCurrentTheme(): AITheme | null {
    return this.currentTheme
  }

  public isAutoMode(): boolean {
    return this.autoMode
  }

  public getThemeRecommendation() {
    try {
      const recommended = this.selectBestTheme()
      const alternatives = AI_THEMES.filter((t) => t.id !== recommended.id).slice(0, 3)

      return {
        recommended,
        alternatives,
        reason: this.getRecommendationReason(recommended),
      }
    } catch (error) {
      console.error("Failed to get theme recommendation:", error)
      return {
        recommended: AI_THEMES[0],
        alternatives: AI_THEMES.slice(1, 4),
        reason: "Default recommendation",
      }
    }
  }

  private getRecommendationReason(theme: AITheme): string {
    const timeOfDay = this.getTimeOfDay()
    const attendance = this.calculateAttendancePercentage()

    if (theme.id === "success-celebration") {
      return "Congratulations! Your excellent attendance deserves celebration! 🎉"
    }
    if (theme.id === "warning-alert") {
      return "Your attendance needs attention. This theme will help motivate you to improve! ⚠️"
    }
    if (theme.timeOfDay === timeOfDay) {
      return `Perfect for ${timeOfDay} study sessions with ${attendance}% attendance`
    }
    return `Recommended based on your ${attendance}% attendance rate`
  }

  public getThemeStats() {
    return {
      currentAttendance: this.calculateAttendancePercentage(),
      currentHour: this.getCurrentHour(),
      availableThemes: AI_THEMES.length,
      autoMode: this.autoMode,
    }
  }

  public getAIMessage(attendancePercentage: number, streak: number): string {
    if (attendancePercentage >= 95) {
      return `🌟 Outstanding! You're maintaining ${attendancePercentage}% attendance with a ${streak}-day streak. You're setting an excellent example!`
    }
    if (attendancePercentage >= 85) {
      return `🎯 Great job! Your ${attendancePercentage}% attendance shows dedication. Keep up the momentum with your ${streak}-day streak!`
    }
    if (attendancePercentage >= 75) {
      return `📈 You're on track with ${attendancePercentage}% attendance. A few more consistent days can boost your streak from ${streak} days!`
    }
    if (attendancePercentage >= 60) {
      return `⚡ Your ${attendancePercentage}% attendance needs attention. Let's rebuild that streak - currently at ${streak} days. You can do this!`
    }
    return `🚨 Time to take action! Your ${attendancePercentage}% attendance is below target. Start fresh today and build a new streak!`
  }

  public onThemeChange(callback: (theme: AITheme) => void): () => void {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

export const aiThemeEngine = new AIThemeEngine()

// Auto-update theme every 30 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      aiThemeEngine.updateTheme()
    },
    30 * 60 * 1000,
  )
}
