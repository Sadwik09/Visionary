"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, Target, Trophy, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function ProfileDisplay() {
  const { userData } = useAuth()

  if (!userData) return null

  const totalPeriods = userData.subjects.reduce((sum, subject) => sum + subject.total, 0)
  const attendedPeriods = userData.subjects.reduce((sum, subject) => sum + subject.attended, 0)
  const overallPercentage = totalPeriods > 0 ? Math.round((attendedPeriods / totalPeriods) * 100) : 0

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { label: "Excellent", color: "bg-green-500" }
    if (percentage >= 75) return { label: "Good", color: "bg-blue-500" }
    if (percentage >= 60) return { label: "Average", color: "bg-yellow-500" }
    return { label: "Poor", color: "bg-red-500" }
  }

  const status = getAttendanceStatus(overallPercentage)

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Student Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt={userData.name} />
            <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{userData.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                ID: {userData.studentId}
              </Badge>
              <Badge className={`text-xs text-white ${status.color}`}>{status.label}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Class: {userData.class}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>Target: {userData.targetAttendance}%</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Trophy className="w-4 h-4" />
              <span>Current: {overallPercentage}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Total Periods: {totalPeriods}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Attended: {attendedPeriods}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Subject Performance</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {userData.subjects.map((subject) => {
              const percentage = Math.round((subject.attended / subject.total) * 100)
              const subjectStatus = getAttendanceStatus(percentage)
              return (
                <div key={subject.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium truncate">{subject.name}</span>
                  <Badge className={`text-xs text-white ${subjectStatus.color}`}>{percentage}%</Badge>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
