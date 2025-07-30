"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Calendar, BookOpen } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AddPeriodModal } from "@/components/add-period-modal"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

export function TimetablePage() {
  const { userData, updateTimetable } = useAuth()
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null)

  if (!userData) return null

  const getTimetableEntry = (day: string, time: string) => {
    return userData.timetable?.find((entry) => entry.day === day && entry.time === time)
  }

  const getSubjectColor = (subjectName: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
    ]
    const index = subjectName.length % colors.length
    return colors[index]
  }

  const handleSlotClick = (day: string, time: string) => {
    setSelectedSlot({ day, time })
  }

  const handleBulkAttendance = (day: string, present: boolean) => {
    const dayEntries = userData.timetable?.filter((entry) => entry.day === day) || []

    dayEntries.forEach((entry) => {
      const subject = userData.subjects.find((s) => s.name === entry.subject)
      if (subject) {
        const updatedSubject = {
          ...subject,
          attended: present ? subject.attended + 1 : subject.attended,
          total: subject.total + 1,
        }
        // This would need to be implemented in the auth context
        // updateSubject(updatedSubject)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Weekly Timetable</h2>
          <p className="text-gray-600">Manage your class schedule and track attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleBulkAttendance("Monday", true)}>
            Mark Day Present
          </Button>
          <Button variant="outline" onClick={() => handleBulkAttendance("Monday", false)}>
            Mark Day Absent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData.timetable?.filter((entry) => entry.day === "Monday").length || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Classes scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Next Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Mathematics</div>
            <p className="text-xs text-gray-600 mt-1">10:00 AM - Room 101</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Weekly Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.timetable?.length || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Total periods this week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Click on any time slot to add or edit a class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 gap-2 mb-4">
                <div className="font-medium text-center p-2">Time</div>
                {DAYS.map((day) => (
                  <div key={day} className="font-medium text-center p-2">
                    {day}
                  </div>
                ))}
              </div>

              {TIME_SLOTS.map((time) => (
                <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                  <div className="text-sm text-gray-600 text-center p-2 border rounded">{time}</div>
                  {DAYS.map((day) => {
                    const entry = getTimetableEntry(day, time)
                    return (
                      <div
                        key={`${day}-${time}`}
                        className="min-h-[60px] border rounded p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSlotClick(day, time)}
                      >
                        {entry ? (
                          <div className="space-y-1">
                            <Badge className={`text-xs ${getSubjectColor(entry.subject)}`}>{entry.subject}</Badge>
                            {entry.room && <p className="text-xs text-gray-600">Room: {entry.room}</p>}
                            {entry.teacher && <p className="text-xs text-gray-600">{entry.teacher}</p>}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Plus className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSlot && (
        <AddPeriodModal
          day={selectedSlot.day}
          time={selectedSlot.time}
          isOpen={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          existingEntry={getTimetableEntry(selectedSlot.day, selectedSlot.time)}
        />
      )}
    </div>
  )
}
