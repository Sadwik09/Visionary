"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Users,
  Bell,
  CheckCircle,
  AlertTriangle,
  LogOut,
  ChevronRight,
  Eye,
  MessageSquare,
  FileText,
  Activity,
  Plus,
  Edit,
  Search,
  Filter,
  Download,
  Upload,
  GraduationCap,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface TeacherDashboardProps {
  onLogout: () => void
}

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const { userData, user } = useAuth()
  const [selectedClass, setSelectedClass] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const students = userData?.students || []
  const subjects = userData?.subjects || []

  const getClassAttendanceAverage = () => {
    if (!students.length) return 0
    const total = students.reduce((sum, student) => sum + student.attendance, 0)
    return Math.round(total / students.length)
  }

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: "Excellent", color: "text-green-600", bgColor: "bg-green-50" }
    if (percentage >= 75) return { status: "Good", color: "text-blue-600", bgColor: "bg-blue-50" }
    if (percentage >= 60) return { status: "Average", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    return { status: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50" }
  }

  const getStudentsAtRisk = () => {
    return students.filter((student) => student.attendance < 75)
  }

  const getTodaysClasses = () => {
    return [
      { subject: "Mathematics", time: "09:00 AM", room: "Room 101", students: 25 },
      { subject: "Physics", time: "11:00 AM", room: "Lab 2", students: 22 },
      { subject: "Chemistry", time: "02:00 PM", room: "Lab 1", students: 28 },
    ]
  }

  const getRecentActivity = () => {
    return [
      { action: "Marked attendance", class: "Mathematics Grade 10", time: "2 hours ago" },
      { action: "Updated grades", class: "Physics Grade 11", time: "1 day ago" },
      { action: "Sent message to parent", student: "John Smith", time: "2 days ago" },
    ]
  }

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Teacher Portal</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>{user?.name?.charAt(0) || "T"}</AvatarFallback>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {userData?.name || user?.name}! 👨‍🏫</h1>
          <p className="text-gray-600">Manage your classes and track student progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Students</CardTitle>
              <Users className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}</div>
              <p className="text-xs text-purple-100">across all classes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Class Average</CardTitle>
              <Target className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getClassAttendanceAverage()}%</div>
              <p className="text-xs text-blue-100">attendance rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{subjects.length}</div>
              <p className="text-xs text-green-100">teaching subjects</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-100">At Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getStudentsAtRisk().length}</div>
              <p className="text-xs text-red-100">students need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Today's Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getTodaysClasses().map((class_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{class_.subject}</p>
                          <p className="text-sm text-gray-600">
                            {class_.room} • {class_.students} students
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">{class_.time}</p>
                          <Button size="sm" variant="outline" className="mt-1 bg-transparent">
                            Mark Attendance
                          </Button>
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
                    <Activity className="w-5 h-5 text-purple-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecentActivity().map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-600">
                            {activity.class || activity.student} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Students at Risk */}
            {getStudentsAtRisk().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Students Requiring Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getStudentsAtRisk().map((student, index) => (
                      <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{student.name}</h3>
                          <Badge variant="destructive">{student.attendance}%</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Below 75% attendance threshold</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Contact Parent
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-sm">Mark Attendance</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <span className="text-sm">Generate Report</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                    <span className="text-sm">Send Message</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Plus className="w-6 h-6 text-orange-600" />
                    <span className="text-sm">Add Student</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Student Management
                  </span>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Students</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="filter">Filter by Class</Label>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      All Classes
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredStudents.map((student, index) => {
                    const status = getAttendanceStatus(student.attendance)
                    return (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{student.name}</h3>
                              <p className="text-sm text-gray-600">ID: {student.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={status.color}>
                              {student.attendance}%
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Subjects</p>
                            <p className="font-medium">{student.subjects.length}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Attendance</p>
                            <p className={`font-medium ${status.color}`}>{student.attendance}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status</p>
                            <p className={`font-medium ${status.color}`}>{status.status}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Last Seen</p>
                            <p className="font-medium">Today</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Attendance Management
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Today's Attendance */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Today's Attendance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {getTodaysClasses().map((class_, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{class_.subject}</CardTitle>
                            <CardDescription>
                              {class_.time} • {class_.room}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm text-gray-600">Students Present</span>
                              <span className="font-medium">
                                {Math.floor(class_.students * 0.85)}/{class_.students}
                              </span>
                            </div>
                            <Progress value={85} className="mb-3" />
                            <Button size="sm" className="w-full">
                              Mark Attendance
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Overview */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-7 gap-4 text-center">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                            <div key={day} className="space-y-2">
                              <p className="text-sm font-medium">{day}</p>
                              <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-lg font-bold text-green-600">
                                  {index < 5 ? Math.floor(Math.random() * 20) + 80 : "-"}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
                    Class Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Overall Class Average</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {getClassAttendanceAverage()}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Students Above 90%</span>
                      <span className="font-medium">{students.filter((s) => s.attendance >= 90).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Students 75-89%</span>
                      <span className="font-medium">
                        {students.filter((s) => s.attendance >= 75 && s.attendance < 90).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Students Below 75%</span>
                      <span className="font-medium text-red-600">{getStudentsAtRisk().length}</span>
                    </div>
                    <Button className="w-full mt-4">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Detailed Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">This Month</span>
                        <span className="text-sm font-medium">{getClassAttendanceAverage()}%</span>
                      </div>
                      <Progress value={getClassAttendanceAverage()} />
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
                        <span className="font-medium text-sm">Parent - Mary Smith</span>
                        <span className="text-xs text-gray-600">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Thank you for the update on John's progress!</p>
                      <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto">
                        Reply <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">Administration</span>
                        <span className="text-xs text-gray-600">1 day ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Monthly report submission deadline: Friday</p>
                      <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto">
                        View Details <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                    <Button className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Compose Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                      <h4 className="font-medium text-sm mb-1">Staff Meeting</h4>
                      <p className="text-sm text-gray-700">Weekly staff meeting tomorrow at 3 PM</p>
                      <span className="text-xs text-gray-600">Posted 1 day ago</span>
                    </div>
                    <div className="p-3 border-l-4 border-green-500 bg-green-50">
                      <h4 className="font-medium text-sm mb-1">System Update</h4>
                      <p className="text-sm text-gray-700">Attendance system will be updated this weekend</p>
                      <span className="text-xs text-gray-600">Posted 3 days ago</span>
                    </div>
                    <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                      <h4 className="font-medium text-sm mb-1">Training Session</h4>
                      <p className="text-sm text-gray-700">New grading system training next week</p>
                      <span className="text-xs text-gray-600">Posted 1 week ago</span>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Announcements
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
