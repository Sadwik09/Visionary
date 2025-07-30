"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"

interface EditSubjectModalProps {
  subject: {
    id: string
    name: string
    attended: number
    total: number
  }
  isOpen: boolean
  onClose: () => void
}

export function EditSubjectModal({ subject, isOpen, onClose }: EditSubjectModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    attended: "",
    total: "",
  })
  const [error, setError] = useState("")
  const { updateSubject, deleteSubject } = useAuth()

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        attended: subject.attended.toString(),
        total: subject.total.toString(),
      })
    }
  }, [subject])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.attended || !formData.total) {
      setError("Please fill in all fields")
      return
    }

    const attended = Number.parseInt(formData.attended)
    const total = Number.parseInt(formData.total)

    if (isNaN(attended) || isNaN(total) || attended < 0 || total < 0) {
      setError("Please enter valid numbers")
      return
    }

    if (attended > total) {
      setError("Attended periods cannot be more than total periods")
      return
    }

    const updatedSubject = {
      ...subject,
      name: formData.name,
      attended,
      total,
    }

    updateSubject(updatedSubject)
    onClose()
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this subject?")) {
      deleteSubject(subject.id)
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
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>Update the subject details and attendance information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editSubjectName">Subject Name</Label>
            <Input
              id="editSubjectName"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Mathematics"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editAttended">Periods Attended</Label>
              <Input
                id="editAttended"
                type="number"
                min="0"
                value={formData.attended}
                onChange={(e) => handleInputChange("attended", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTotal">Total Periods</Label>
              <Input
                id="editTotal"
                type="number"
                min="0"
                value={formData.total}
                onChange={(e) => handleInputChange("total", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-between">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Subject
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Update Subject</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
