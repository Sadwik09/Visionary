"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function AddSubjectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    attended: "",
    total: "",
  })
  const [error, setError] = useState("")
  const { addSubject } = useAuth()

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

    const newSubject = {
      id: Date.now().toString(),
      name: formData.name,
      attended,
      total,
    }

    addSubject(newSubject)
    setIsOpen(false)
    setFormData({ name: "", attended: "", total: "" })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>Add a new subject to track your attendance.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjectName">Subject Name</Label>
            <Input
              id="subjectName"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Mathematics"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attended">Periods Attended</Label>
              <Input
                id="attended"
                type="number"
                min="0"
                value={formData.attended}
                onChange={(e) => handleInputChange("attended", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total Periods</Label>
              <Input
                id="total"
                type="number"
                min="0"
                value={formData.total}
                onChange={(e) => handleInputChange("total", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Subject</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
