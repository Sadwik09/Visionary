"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, AlertTriangle, CheckCircle, ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AddSubjectModal } from "./add-subject-modal"
import { EditSubjectModal } from "./edit-subject-modal"
import { useToast } from "@/hooks/use-toast"

interface AttendancePageProps {
  onBack: () => void
}

export function AttendancePage({ onBack }: AttendancePageProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState<any>(null)
  const { userData, updateUserData } = useAuth()
  const { toast } = useToast()

  if (!userData) return null

  const updateSubjectAttendance = (subjectId: number, isPresent: boolean) => {
    const updatedSubjects = userData.subjects.map((subject) => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          attended: subject.attended + (isPresent ? 1 : 0),
          total: subject.total + 1,
        }
      }
      return subject
    })
    updateUserData({ subjects: updatedSubjects })
  }

  const markAllPresentToday = () => {
    const updatedSubjects = userData.subjects.map((subject) => {
      return {
        ...subject,
        attended: subject.attended + 1,
        total: subject.total + 1,
      }
    })
    updateUserData({ subjects: updatedSubjects })
    toast({
      title: "All Present",
      description: `Marked present for all ${userData.subjects.length} subjects today.`,
      variant: "success",
    })
  }

  const markAllAbsentToday = () => {
    const updatedSubjects = userData.subjects.map((subject) => {
      return {
        ...subject,
        total: subject.total + 1,
      }
    })
    updateUserData({ subjects: updatedSubjects })
    toast({
      title: "All Absent",
      description: `Marked absent for all ${userData.subjects.length} subjects today.`,
      variant: "destructive",
    })
  }

  const deleteSubject = (subjectId: number) => {
    const updatedSubjects = userData.subjects.filter((subject) => subject.id !== subjectId)

    // Remove from timetable
    const updatedTimetable = { ...userData.timetable }
    Object.keys(updatedTimetable).forEach((day) => {
      updatedTimetable[day] = updatedTimetable[day].filter((period) => period.subjectId !== subjectId)
    })

    updateUserData({ subjects: updatedSubjects, timetable: updatedTimetable })
    toast({
      title: "Subject Deleted",
      description: "Subject and related timetable entries have been removed.",
    })
  }

  const calculatePeriodsToTarget = (subject: any) => {
    if (subject.total === 0) return 0
    const target = userData.targetAttendance
    const currentPercentage = (subject.attended / subject.total) * 100

    if (currentPercentage >= target) return 0

    let needed = 0
    let newAttended = subject.attended
    let newTotal = subject.total

    while ((newAttended / newTotal) * 100 < target) {
      newAttended += 1
      newTotal += 1
      needed += 1
    }

    return needed
  }

  // Calculate summary stats
  const totalPeriods = userData.subjects.reduce((sum, subject) => sum + subject.total, 0)
  const presentPeriods = userData.subjects.reduce((sum, subject) => sum + subject.attended, 0)
  const absentPeriods = totalPeriods - presentPeriods
  const overallPercentage = totalPeriods > 0 ? Math.round((presentPeriods / totalPeriods) * 100) : 0
  const isDanger = overallPercentage < userData.targetAttendance

  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-yellow-400">
          <h1 className="text-3xl font-bold text-blue-600">Attendance</h1>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium text-gray-600 mb-2">Total Periods</h3>
                <p className="text-2xl font-bold">{totalPeriods}</p>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium text-gray-600 mb-2">Present</h3>
                <p className="text-2xl font-bold">{presentPeriods}</p>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium text-gray-600 mb-2">Absent</h3>
                <p className="text-2xl font-bold">{absentPeriods}</p>
              </div>
              <div className={`text-center p-4 rounded-lg text-white ${isDanger ? "bg-red-500" : "bg-green-500"}`}>
                <h3 className="font-medium mb-2">Overall Percentage</h3>
                <p className="text-2xl font-bold">{overallPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={() => setShowAddModal(true)}>
            <BookOpen className="w-4 h-4 mr-2" />
            Add Subject
          </Button>

          <Button
            onClick={markAllPresentToday}
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Present All Day
          </Button>

          <Button
            onClick={markAllAbsentToday}
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Absent All Day
          </Button>
        </div>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData.subjects.map((subject) => {
            const attendancePercentage = Math.round((subject.attended / subject.total) * 100) || 0
            const isSubjectDanger = attendancePercentage < userData.targetAttendance
            const periodsNeeded = calculatePeriodsToTarget(subject)

            return (
              <Card
                key={subject.id}
                className={`relative ${isSubjectDanger ? "border-l-4 border-l-red-500" : "border-l-4 border-l-green-500"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-blue-600">{subject.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditingSubject(subject)}>
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSubject(subject.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium mr-2">
                      {attendancePercentage}%
                    </span>
                    <span className="text-sm text-gray-600">
                      {subject.attended}/{subject.total} periods
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={isSubjectDanger ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                        {isSubjectDanger ? "Danger" : "Safe"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To reach target ({userData.targetAttendance}%):</span>
                      <span className="font-medium">{periodsNeeded} more periods</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => updateSubjectAttendance(subject.id, true)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => updateSubjectAttendance(subject.id, false)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {userData.subjects.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">No subjects added yet. Click the "Add Subject" button to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AddSubjectModal open={showAddModal} onOpenChange={setShowAddModal} />
      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          open={!!editingSubject}
          onOpenChange={(open) => !open && setEditingSubject(null)}
        />
      )}
    </div>
  )
}
