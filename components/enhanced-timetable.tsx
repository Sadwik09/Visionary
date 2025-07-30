"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Plus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

export function EnhancedTimetable() {
  const { userData } = useAuth()
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  if (!userData) return null

  const getTodayClasses = () => {
    return userData.timetable?.filter((entry) => entry.day === selectedDay) || []
  }

  const getSubjectColor = (subjectName: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-pink-100 text-pink-800 border-pink-200",
    ]
    const index = subjectName.length % colors.length
    return colors[index]
  }

  const markAttendance = (entryId: string, present: boolean) => {
    // This would update the attendance in the backend
    console.log(`Marking ${entryId} as ${present ? "present" : "absent"}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Timetable</h2>
          <p className="text-gray-600">Interactive schedule with attendance tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")}>
            Grid View
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
            List View
          </Button>
        </div>
      </div>

      {/* Day Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                onClick={() => setSelectedDay(day)}
                className="flex-1 min-w-[120px]"
              >
                {day}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {selectedDay}'s Schedule
          </CardTitle>
          <CardDescription>{getTodayClasses().length} classes scheduled</CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "list" ? (
            <div className="space-y-4">
              {getTodayClasses().length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No classes scheduled for {selectedDay}</p>
                  <Button variant="outline" className="mt-4 bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Class
                  </Button>
                </div>
              ) : (
                getTodayClasses().map((entry) => (
                  <div key={entry.id} className={`p-4 rounded-lg border-2 ${getSubjectColor(entry.subject)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{entry.subject}</h3>
                        <div className="flex items-center gap-4 text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {entry.time}
                          </span>
                          {entry.room && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {entry.room}
                            </span>
                          )}
                          {entry.teacher && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {entry.teacher}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                          onClick={() => markAttendance(entry.id, true)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                          onClick={() => markAttendance(entry.id, false)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    </div>

                    {/* Subject Stats */}
                    <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                      <div className="flex justify-between text-sm">
                        <span>Subject Attendance:</span>
                        <span className="font-medium">
                          {(() => {
                            const subject = userData.subjects.find((s) => s.name === entry.subject)
                            return subject ? Math.round((subject.attended / subject.total) * 100) : 0
                          })()}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getTodayClasses().length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No classes scheduled for {selectedDay}</p>
                  <Button variant="outline" className="mt-4 bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Class
                  </Button>
                </div>
              ) : (
                getTodayClasses().map((entry) => (
                  <Card key={entry.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{entry.subject}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {entry.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {entry.room && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{entry.room}</span>
                        </div>
                      )}
                      {entry.teacher && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{entry.teacher}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                          onClick={() => markAttendance(entry.id, true)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                          onClick={() => markAttendance(entry.id, false)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Quick glance at your entire week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {DAYS.map((day) => {
              const dayClasses = userData.timetable?.filter((entry) => entry.day === day) || []
              return (
                <div key={day} className="text-center">
                  <h4 className="font-medium mb-2">{day}</h4>
                  <div className="space-y-1">
                    {dayClasses.length === 0 ? (
                      <div className="text-xs text-gray-400 py-2">No classes</div>
                    ) : (
                      dayClasses.map((entry) => (
                        <Badge key={entry.id} variant="outline" className="text-xs block w-full py-1">
                          {entry.time.split(" ")[0]} - {entry.subject}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
