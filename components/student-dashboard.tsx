"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  Palette,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  Brain,
  Mic,
  Shield,
  History,
  ChevronRight,
  Plus,
  Bell,
  Star,
  Award,
  CheckCircle,
  CalendarIcon,
  Sparkles,
  LogOut,
  Eye,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AttendancePage } from "./attendance-page"
import { TimetablePage } from "./timetable-page"
import { SettingsPage } from "./settings-page"
import { AIThemeDashboard } from "./ai-theme-dashboard"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { EnhancedTimetable } from "./enhanced-timetable"
import { GamificationDashboard } from "./gamification-dashboard"
import { VoiceAssistant } from "./voice-assistant"
import { AuditLogsViewer } from "./audit-logs-viewer"
import { VersionHistoryViewer } from "./version-history-viewer"
import { AIChatbot } from "./ai-chatbot"

type DashboardView =
  | "dashboard"
  | "attendance"
  | "timetable"
  | "settings"
  | "ai-themes"
  | "analytics"
  | "enhanced-timetable"
  | "gamification"
  | "voice-assistant"
  | "audit-logs"
  | "version-history"
  | "ai-chatbot"

interface StudentDashboardProps {
  onLogout: () => void
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("dashboard")
  const { userData, user } = useAuth()

  const calculateOverallAttendance = () => {
    if (!userData?.subjects?.length) return 0
    const totalPeriods = userData.subjects.reduce((sum, subject) => sum + subject.total, 0)
    const attendedPeriods = userData.subjects.reduce((sum, subject) => sum + subject.attended, 0)
    return totalPeriods > 0 ? Math.round((attendedPeriods / totalPeriods) * 100) : 0
  }

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: "Excellent", color: "text-green-600", bgColor: "bg-green-50" }
    if (percentage >= 75) return { status: "Good", color: "text-blue-600", bgColor: "bg-blue-50" }
    if (percentage >= 60) return { status: "Average", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    return { status: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50" }
  }

  const getCurrentStreak = () => {
    return 7 // Mock streak calculation
  }

  const getTotalSubjects = () => {
    return userData?.subjects?.length || 0
  }

  const getUpcomingClasses = () => {
    return [
      { subject: "Mathematics", time: "09:00 AM", room: "Room 101" },
      { subject: "Physics", time: "11:00 AM", room: "Lab 2" },
      { subject: "Chemistry", time: "02:00 PM", room: "Lab 1" },
    ]
  }

  const getRecentActivity = () => {
    return [
      { action: "Marked present", subject: "Mathematics", time: "2 hours ago" },
      { action: "Added new subject", subject: "Computer Science", time: "1 day ago" },
      { action: "Updated timetable", subject: "Physics", time: "2 days ago" },
    ]
  }

  const coreFeatures = [
    {
      id: "attendance",
      name: "Attendance Tracking",
      description: "Mark and track your daily attendance",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      view: "attendance" as DashboardView,
    },
    {
      id: "timetable",
      name: "Timetable Management",
      description: "Manage your class schedule",
      icon: CalendarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      view: "timetable" as DashboardView,
    },
    {
      id: "analytics",
      name: "Analytics Dashboard",
      description: "View detailed attendance analytics",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      view: "analytics" as DashboardView,
    },
    {
      id: "ai-themes",
      name: "AI Themes",
      description: "Intelligent themes that adapt to you",
      icon: Palette,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      view: "ai-themes" as DashboardView,
    },
    {
      id: "gamification",
      name: "Achievements",
      description: "Track your progress and earn rewards",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      view: "gamification" as DashboardView,
    },
    {
      id: "settings",
      name: "Settings",
      description: "Customize your experience",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      view: "settings" as DashboardView,
    },
  ]

  const advancedFeatures = [
    {
      id: "enhanced-timetable",
      name: "Enhanced Timetable",
      description: "Advanced scheduling with drag & drop",
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      view: "enhanced-timetable" as DashboardView,
    },
    {
      id: "voice-assistant",
      name: "Voice Assistant",
      description: "Control with voice commands",
      icon: Mic,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      view: "voice-assistant" as DashboardView,
    },
    {
      id: "ai-chatbot",
      name: "AI Assistant",
      description: "Get help from AI chatbot",
      icon: Brain,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      view: "ai-chatbot" as DashboardView,
    },
    {
      id: "audit-logs",
      name: "Audit Logs",
      description: "Track all system changes",
      icon: Shield,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      view: "audit-logs" as DashboardView,
    },
    {
      id: "version-history",
      name: "Version History",
      description: "View and restore previous versions",
      icon: History,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      view: "version-history" as DashboardView,
    },
  ]

  if (currentView !== "dashboard") {
    const renderView = () => {
      switch (currentView) {
        case "attendance":
          return <AttendancePage onBack={() => setCurrentView("dashboard")} />
        case "timetable":
          return <TimetablePage onBack={() => setCurrentView("dashboard")} />
        case "settings":
          return <SettingsPage onBack={() => setCurrentView("dashboard")} onLogout={onLogout} />
        case "ai-themes":
          return <AIThemeDashboard onBack={() => setCurrentView("dashboard")} />
        case "analytics":
          return <AnalyticsDashboard onBack={() => setCurrentView("dashboard")} />
        case "enhanced-timetable":
          return <EnhancedTimetable onBack={() => setCurrentView("dashboard")} />
        case "gamification":
          return <GamificationDashboard onBack={() => setCurrentView("dashboard")} />
        case "voice-assistant":
          return <VoiceAssistant onBack={() => setCurrentView("dashboard")} />
        case "audit-logs":
          return <AuditLogsViewer onBack={() => setCurrentView("dashboard")} />
        case "version-history":
          return <VersionHistoryViewer onBack={() => setCurrentView("dashboard")} />
        case "ai-chatbot":
          return <AIChatbot onBack={() => setCurrentView("dashboard")} />
        default:
          return null
      }
    }

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("dashboard")}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Visionary Dashboard
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        <main className="container py-6">{renderView()}</main>
      </div>
    )
  }

  const overallAttendance = calculateOverallAttendance()
  const attendanceStatus = getAttendanceStatus(overallAttendance)
  const currentStreak = getCurrentStreak()
  const totalSubjects = getTotalSubjects()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Visionary</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>{user?.name?.charAt(0) || "S"}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {userData?.name || user?.name}! 👋</h1>
          <p className="text-gray-600">Here's your attendance overview for today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Overall Attendance</CardTitle>
              <Target className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overallAttendance}%</div>
              <p className="text-xs text-green-100">{attendanceStatus.status}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Current Streak</CardTitle>
              <Zap className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentStreak}</div>
              <p className="text-xs text-blue-100">days in a row</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSubjects}</div>
              <p className="text-xs text-purple-100">subjects enrolled</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">92%</div>
              <p className="text-xs text-orange-100">weekly average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getUpcomingClasses().map((class_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{class_.subject}</p>
                          <p className="text-sm text-gray-600">{class_.room}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">{class_.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecentActivity().map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-600">
                            {activity.subject} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {coreFeatures.map((feature) => (
                    <Button
                      key={feature.id}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                      onClick={() => setCurrentView(feature.view)}
                    >
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      <span className="text-xs font-medium text-center">{feature.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Subject Details
                  </span>
                  <Button size="sm" onClick={() => setCurrentView("attendance")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subject
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData?.subjects?.length ? (
                  <div className="space-y-4">
                    {userData.subjects.map((subject, index) => {
                      const percentage = subject.total > 0 ? Math.round((subject.attended / subject.total) * 100) : 0
                      const status = getAttendanceStatus(percentage)

                      return (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">{subject.name}</h3>
                            <Badge variant="outline" className={status.color}>
                              {percentage}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Total Classes</p>
                              <p className="font-medium">{subject.total}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Attended</p>
                              <p className="font-medium text-green-600">{subject.attended}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Missed</p>
                              <p className="font-medium text-red-600">{subject.total - subject.attended}</p>
                            </div>
                          </div>
                          <Progress value={percentage} className="mt-3" />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No subjects added yet</p>
                    <Button onClick={() => setCurrentView("attendance")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Subject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6" />
                    Perfect Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-100">Attended all classes this week</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">Earned 2 days ago</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Consistency Master
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100">7-day attendance streak</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">Active streak</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    Goal Achiever
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100">Reached 90% attendance</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">Earned 1 week ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            {/* Core Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Core Features
                </CardTitle>
                <CardDescription>Essential tools for attendance management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coreFeatures.map((feature) => (
                    <Card key={feature.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                            <feature.icon className={`w-5 h-5 ${feature.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{feature.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCurrentView(feature.view)}
                              className="w-full"
                            >
                              Open <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Advanced Features
                </CardTitle>
                <CardDescription>Powerful tools for enhanced productivity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {advancedFeatures.map((feature) => (
                    <Card key={feature.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                            <feature.icon className={`w-5 h-5 ${feature.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{feature.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCurrentView(feature.view)}
                              className="w-full"
                            >
                              Open <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
