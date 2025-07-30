"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"

interface AddPeriodModalProps {
  day: string
  time: string
  isOpen: boolean
  onClose: () => void
  existingEntry?: {
    id: string
    day: string
    time: string
    subject: string
    room?: string
    teacher?: string
  }
}

export function AddPeriodModal({ day, time, isOpen, onClose, existingEntry }: AddPeriodModalProps) {
  const [formData, setFormData] = useState({
    subject: "",
    room: "",
    teacher: "",
  })
  const [error, setError] = useState("")
  const { userData, updateTimetable, deleteTimetableEntry } = useAuth()

  useEffect(() => {
    if (existingEntry) {
      setFormData({
        subject: existingEntry.subject,
        room: existingEntry.room || "",
        teacher: existingEntry.teacher || "",
      })
    } else {
      setFormData({ subject: "", room: "", teacher: "" })
    }
  }, [existingEntry])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.subject) {
      setError("Please select a subject")
      return
    }

    const entryData = {
      id: existingEntry?.id || Date.now().toString(),
      day,
      time,
      subject: formData.subject,
      room: formData.room,
      teacher: formData.teacher,
    }

    updateTimetable(entryData)
    onClose()
  }

  const handleDelete = () => {
    if (existingEntry && confirm("Are you sure you want to delete this period?")) {
      deleteTimetableEntry(existingEntry.id)
      onClose()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{existingEntry ? "Edit Period" : "Add Period"}</DialogTitle>
          <DialogDescription>
            {day} at {time}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {userData?.subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room">Room (Optional)</Label>
            <Input
              id="room"
              value={formData.room}
              onChange={(e) => handleInputChange("room", e.target.value)}
              placeholder="e.g., Room 101"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher (Optional)</Label>
            <Input
              id="teacher"
              value={formData.teacher}
              onChange={(e) => handleInputChange("teacher", e.target.value)}
              placeholder="e.g., Dr. Smith"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-between">
            {existingEntry && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete Period
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{existingEntry ? "Update" : "Add"} Period</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
