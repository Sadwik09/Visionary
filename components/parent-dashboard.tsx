"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Bell,
  CheckCircle,
  AlertTriangle,
  LogOut,
  User,
  Phone,
  Mail,
  School,
  ChevronRight,
  Eye,
  MessageSquare,
  FileText,
  Activity,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface ParentDashboardProps {
  onLogout: () => void
}

export function ParentDashboard({ onLogout }: ParentDashboardProps) {
  const { userData, user } = useAuth()
  const [selectedChild, setSelectedChild] = useState(0)

  const children = userData?.children || []
  const currentChild = children[selectedChild]

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: "Excellent", color: "text-green-600", bgColor: "bg-green-50" }
    if (percentage >= 75) return { status: "Good", color: "text-blue-600", bgColor: "bg-blue-50" }
    if (percentage >= 60) return { status: "Average", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    return { status: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50" }
  }

  const getWeeklyReport = () => {
    return [
      { day: "Monday", status: "Present", subjects: 4 },
      { day: "Tuesday", status: "Present", subjects: 3 },
      { day: "Wednesday", status: "Absent", subjects: 4 },
      { day: "Thursday", status: "Present", subjects: 5 },
      { day: "Friday", status: "Present", subjects: 3 },
    ]
  }

  const getAlerts = () => {
    return [
      {
        type: "warning",
        message: "Mathematics attendance below 75%",
        time: "2 hours ago",
        action: "Contact teacher",
      },
      {
        type: "info",
        message: "Parent-teacher meeting scheduled",
        time: "1 day ago",
        action: "View details",
      },
      {
        type: "success",
        message: "Perfect attendance this week!",
        time: "3 days ago",
        action: "View report",
      },
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Parent Portal</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>{user?.name?.charAt(0) || "P"}</AvatarFallback>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {userData?.name || user?.name}! 👨‍👩‍👧‍👦</h1>
          <p className="text-gray-600">Monitor your child's academic progress and attendance</p>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Child</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {children.map((child, index) => (
                  <Button
                    key={child.id}
                    variant={selectedChild === index ? "default" : "outline"}
                    onClick={() => setSelectedChild(index)}
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {child.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentChild ? (
          <>
            {/* Child Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-100">Overall Attendance</CardTitle>
                  <Target className="h-4 w-4 text-green-100" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{currentChild.attendance}%</div>
                  <p className="text-xs text-green-100">{getAttendanceStatus(currentChild.attendance).status}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Total Subjects</CardTitle>
                  <BookOpen className="h-4 w-4 text-blue-100" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{currentChild.subjects.length}</div>
                  <p className="text-xs text-blue-100">subjects enrolled</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100">This Week</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-100" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4/5</div>
                  <p className="text-xs text-purple-100">days present</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-100">Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-orange-100" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2</div>
                  <p className="text-xs text-orange-100">need attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Attendance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        This Week's Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getWeeklyReport().map((day, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{day.day}</p>
                              <p className="text-sm text-gray-600">{day.subjects} subjects</p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={day.status === "Present" ? "default" : "destructive"}
                                className={day.status === "Present" ? "bg-green-100 text-green-800" : ""}
                              >
                                {day.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alerts & Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-600" />
                        Alerts & Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getAlerts().map((alert, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                            {alert.type === "warning" && (
                              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            )}
                            {alert.type === "info" && <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                            {alert.type === "success" && (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{alert.message}</p>
                              <p className="text-xs text-gray-600 mb-2">{alert.time}</p>
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                {alert.action}
                              </Button>
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
                      <Activity className="w-5 h-5 text-purple-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                        <Phone className="w-6 h-6 text-blue-600" />
                        <span className="text-sm">Contact School</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                        <MessageSquare className="w-6 h-6 text-green-600" />
                        <span className="text-sm">Message Teacher</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                        <FileText className="w-6 h-6 text-purple-600" />
                        <span className="text-sm">View Reports</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <span className="text-sm">Schedule Meeting</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subjects" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Subject Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentChild.subjects.map((subject, index) => {
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
                            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
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
                            <Progress value={percentage} className="mb-2" />
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${status.color}`}>{status.status}</span>
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        Monthly Report
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Overall Performance</span>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Excellent
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Attendance Rate</span>
                          <span className="font-medium">{currentChild.attendance}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Days Present</span>
                          <span className="font-medium">18/20</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Days Absent</span>
                          <span className="font-medium text-red-600">2</span>
                        </div>
                        <Button className="w-full mt-4">
                          <FileText className="w-4 h-4 mr-2" />
                          Download Full Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Progress Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">This Month</span>
                            <span className="text-sm font-medium">{currentChild.attendance}%</span>
                          </div>
                          <Progress value={currentChild.attendance} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Last Month</span>
                            <span className="text-sm font-medium">82%</span>
                          </div>
                          <Progress value={82} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">3 Months Ago</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <Progress value={78} />
                        </div>
                        <div className="text-center pt-4">
                          <div className="text-2xl font-bold text-green-600">+7%</div>
                          <p className="text-sm text-gray-600">Improvement this quarter</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="communication" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        Recent Messages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">Math Teacher</span>
                            <span className="text-xs text-gray-600">2 hours ago</span>
                          </div>
                          <p className="text-sm text-gray-700">Great improvement in algebra this week!</p>
                          <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto">
                            Reply <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">Class Teacher</span>
                            <span className="text-xs text-gray-600">1 day ago</span>
                          </div>
                          <p className="text-sm text-gray-700">Parent-teacher meeting scheduled for next week.</p>
                          <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto">
                            View Details <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                        <Button className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send New Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <School className="w-5 h-5 text-purple-600" />
                        School Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Institution</p>
                          <p className="font-medium">Tech University</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Class Teacher</p>
                          <p className="font-medium">Dr. Robert Johnson</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-medium">+1234567892</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">robert.johnson@teacher.edu</p>
                        </div>
                        <div className="pt-4 space-y-2">
                          <Button variant="outline" className="w-full bg-transparent">
                            <Phone className="w-4 h-4 mr-2" />
                            Call School
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Children Found</h3>
              <p className="text-gray-600 mb-4">No children are linked to your parent account yet.</p>
              <Button>Contact School Administration</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
