"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Palette,
  Sparkles,
  Clock,
  Target,
  Zap,
  Sun,
  Sunset,
  CloudMoon,
  Eye,
  Settings,
  BarChart3,
  Play,
  Square,
} from "lucide-react"
import { aiThemeEngine, AI_THEMES, type AITheme } from "@/lib/ai-themes"
import { useAuth } from "@/hooks/use-auth"

interface AIThemeDashboardProps {
  onBack: () => void
}

export function AIThemeDashboard({ onBack }: AIThemeDashboardProps) {
  const [currentTheme, setCurrentTheme] = useState<AITheme | null>(null)
  const [autoMode, setAutoMode] = useState(true)
  const [previewTheme, setPreviewTheme] = useState<AITheme | null>(null)
  const [previewTimer, setPreviewTimer] = useState<NodeJS.Timeout | null>(null)
  const [themeStats, setThemeStats] = useState<any>(null)
  const [recommendation, setRecommendation] = useState<any>(null)
  const { userData } = useAuth()

  useEffect(() => {
    setCurrentTheme(aiThemeEngine.getCurrentTheme())
    setAutoMode(aiThemeEngine.isAutoMode())
    setThemeStats(aiThemeEngine.getThemeStats())
    setRecommendation(aiThemeEngine.getThemeRecommendation())

    const unsubscribe = aiThemeEngine.onThemeChange((theme) => {
      setCurrentTheme(theme)
    })

    return () => {
      unsubscribe()
      if (previewTimer) {
        clearTimeout(previewTimer)
      }
    }
  }, [previewTimer])

  const handleThemeSelect = (theme: AITheme) => {
    // Stop any active preview
    if (previewTimer) {
      clearTimeout(previewTimer)
      setPreviewTimer(null)
    }
    setPreviewTheme(null)

    // Apply the theme
    aiThemeEngine.selectTheme(theme.id)
    setCurrentTheme(theme)
    setAutoMode(false)
  }

  const handleAutoModeToggle = (enabled: boolean) => {
    setAutoMode(enabled)
    aiThemeEngine.setAutoMode(enabled)
    if (enabled) {
      setCurrentTheme(aiThemeEngine.getCurrentTheme())
    }
  }

  const handlePreviewTheme = (theme: AITheme) => {
    // If already previewing this theme, stop preview
    if (previewTheme?.id === theme.id) {
      if (previewTimer) {
        clearTimeout(previewTimer)
        setPreviewTimer(null)
      }
      setPreviewTheme(null)
      // Restore current theme
      if (currentTheme) {
        aiThemeEngine.selectTheme(currentTheme.id)
      }
      return
    }

    // Clear any existing preview timer
    if (previewTimer) {
      clearTimeout(previewTimer)
    }

    // Start new preview
    setPreviewTheme(theme)
    aiThemeEngine.selectTheme(theme.id)

    // Set timer to revert after 5 seconds
    const timer = setTimeout(() => {
      setPreviewTheme(null)
      if (currentTheme) {
        aiThemeEngine.selectTheme(currentTheme.id)
      }
      setPreviewTimer(null)
    }, 5000)

    setPreviewTimer(timer)
  }

  const getThemeIcon = (theme: AITheme) => {
    switch (theme.timeOfDay) {
      case "morning":
        return <Sun className="w-5 h-5" />
      case "afternoon":
        return <Sun className="w-5 h-5" />
      case "evening":
        return <Sunset className="w-5 h-5" />
      case "night":
        return <CloudMoon className="w-5 h-5" />
      default:
        return <Palette className="w-5 h-5" />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "energetic":
        return "text-orange-600"
      case "focused":
        return "text-blue-600"
      case "calm":
        return "text-purple-600"
      case "cozy":
        return "text-indigo-600"
      case "celebratory":
        return "text-green-600"
      case "urgent":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const calculateOverallAttendance = () => {
    if (!userData?.subjects?.length) return 0
    const totalPeriods = userData.subjects.reduce((sum, s) => sum + s.total, 0)
    const attendedPeriods = userData.subjects.reduce((sum, s) => sum + s.attended, 0)
    return totalPeriods > 0 ? Math.round((attendedPeriods / totalPeriods) * 100) : 0
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              AI Themes
            </h1>
            <p className="text-muted-foreground">Intelligent themes that adapt to your attendance and time of day</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Auto Mode</span>
            <Switch checked={autoMode} onCheckedChange={handleAutoModeToggle} />
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Theme</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTheme?.name || "None"}</div>
            <p className="text-xs text-muted-foreground">{currentTheme?.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateOverallAttendance()}%</div>
            <Progress value={calculateOverallAttendance()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time of Day</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {new Date().getHours() >= 6 && new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() >= 12 && new Date().getHours() < 17
                  ? "Afternoon"
                  : new Date().getHours() >= 17 && new Date().getHours() < 21
                    ? "Evening"
                    : "Night"}
            </div>
            <p className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Preview Alert */}
      {previewTheme && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                <span className="font-medium">Previewing: {previewTheme.name}</span>
                <span className="text-sm text-muted-foreground">- Reverting in 5 seconds...</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (previewTimer) {
                    clearTimeout(previewTimer)
                    setPreviewTimer(null)
                  }
                  setPreviewTheme(null)
                  if (currentTheme) {
                    aiThemeEngine.selectTheme(currentTheme.id)
                  }
                }}
              >
                <Square className="w-4 h-4 mr-1" />
                Stop Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="themes">Available Themes</TabsTrigger>
          <TabsTrigger value="recommendation">AI Recommendation</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_THEMES.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  currentTheme?.id === theme.id ? "ring-2 ring-primary" : ""
                } ${previewTheme?.id === theme.id ? "ring-2 ring-yellow-500" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getThemeIcon(theme)}
                      {theme.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      {currentTheme?.id === theme.id && <Badge variant="default">Active</Badge>}
                      {previewTheme?.id === theme.id && <Badge variant="secondary">Preview</Badge>}
                    </div>
                  </div>
                  <CardDescription>{theme.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mood Badge */}
                  <Badge variant="outline" className={getMoodColor(theme.mood)}>
                    {theme.mood}
                  </Badge>

                  {/* Color Preview */}
                  <div className="flex gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary Color"
                    />
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary Color"
                    />
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent Color"
                    />
                  </div>

                  {/* Attendance Range */}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Best for: </span>
                    <span className="font-medium">
                      {theme.attendanceRange[0]}% - {theme.attendanceRange[1]}% attendance
                    </span>
                  </div>

                  {/* Time of Day */}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Time: </span>
                    <span className="font-medium capitalize">{theme.timeOfDay}</span>
                  </div>

                  {/* Effects */}
                  <div className="flex flex-wrap gap-1">
                    {theme.effects.animations && (
                      <Badge variant="secondary" className="text-xs">
                        Animations
                      </Badge>
                    )}
                    {theme.effects.gradients && (
                      <Badge variant="secondary" className="text-xs">
                        Gradients
                      </Badge>
                    )}
                    {theme.effects.glows && (
                      <Badge variant="secondary" className="text-xs">
                        Glows
                      </Badge>
                    )}
                    {theme.effects.shadows && (
                      <Badge variant="secondary" className="text-xs">
                        Shadows
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreviewTheme(theme)}
                      className="flex-1"
                      disabled={false} // Preview is now always enabled
                    >
                      {previewTheme?.id === theme.id ? (
                        <>
                          <Square className="w-4 h-4 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Preview
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleThemeSelect(theme)}
                      className="flex-1"
                      variant={currentTheme?.id === theme.id ? "default" : "outline"}
                      disabled={currentTheme?.id === theme.id}
                    >
                      {currentTheme?.id === theme.id ? "Active" : "Select"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendation" className="space-y-6">
          {recommendation && (
            <div className="space-y-6">
              {/* Recommended Theme */}
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Recommended Theme
                  </CardTitle>
                  <CardDescription>{recommendation.reason}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getThemeIcon(recommendation.recommended)}
                      <div>
                        <h3 className="font-semibold">{recommendation.recommended.name}</h3>
                        <p className="text-sm text-muted-foreground">{recommendation.recommended.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleThemeSelect(recommendation.recommended)}
                      disabled={currentTheme?.id === recommendation.recommended.id}
                    >
                      {currentTheme?.id === recommendation.recommended.id ? "Active" : "Apply Theme"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Themes */}
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Suggestions</CardTitle>
                  <CardDescription>Other themes that might work well for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendation.alternatives.map((theme: AITheme) => (
                      <div key={theme.id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          {getThemeIcon(theme)}
                          <h4 className="font-medium">{theme.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>
                        <Button size="sm" variant="outline" onClick={() => handleThemeSelect(theme)} className="w-full">
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Theme Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Available Themes:</span>
                  <span className="font-semibold">{AI_THEMES.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Attendance:</span>
                  <span className="font-semibold">{calculateOverallAttendance()}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto Mode:</span>
                  <span className="font-semibold">{autoMode ? "Enabled" : "Disabled"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Hour:</span>
                  <span className="font-semibold">{new Date().getHours()}:00</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Theme Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Smart Auto-Selection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Time-Based Themes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Attendance-Driven</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span>5-Second Preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    <span>Visual Effects</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Theme Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Suitability by Attendance</CardTitle>
              <CardDescription>Which themes work best for different attendance levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {AI_THEMES.map((theme) => (
                  <div key={theme.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getThemeIcon(theme)}
                        <span className="font-medium">{theme.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {theme.attendanceRange[0]}% - {theme.attendanceRange[1]}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: theme.colors.primary,
                          width: `${theme.attendanceRange[1] - theme.attendanceRange[0]}%`,
                          marginLeft: `${theme.attendanceRange[0]}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
