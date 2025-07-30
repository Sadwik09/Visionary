"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Bell, Palette, Target, Download, Upload, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"

export function SettingsPage() {
  const { userData, updateUserData, logout } = useAuth()
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    targetAttendance: userData?.targetAttendance || 75,
  })
  const [notifications, setNotifications] = useState({
    lowAttendance: true,
    dailyReminder: false,
    weeklyReport: true,
  })

  const handleSaveProfile = () => {
    if (userData) {
      updateUserData({
        ...userData,
        name: formData.name,
        email: formData.email,
        targetAttendance: formData.targetAttendance,
      })
    }
  }

  const handleExportData = () => {
    if (userData) {
      const dataStr = JSON.stringify(userData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = "attendance-data.json"
      link.click()
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          updateUserData(importedData)
          alert("Data imported successfully!")
        } catch (error) {
          alert("Error importing data. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear()
      logout()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" value={userData?.studentId || ""} disabled />
            </div>
            <Button onClick={handleSaveProfile} className="w-full">
              Save Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Attendance Target
            </CardTitle>
            <CardDescription>Set your attendance goal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target Attendance: {formData.targetAttendance}%</Label>
              <Slider
                value={[formData.targetAttendance]}
                onValueChange={(value) => setFormData({ ...formData, targetAttendance: value[0] })}
                max={100}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Current attendance:{" "}
                {userData
                  ? Math.round(
                      (userData.subjects.reduce((sum, s) => sum + s.attended, 0) /
                        userData.subjects.reduce((sum, s) => sum + s.total, 0)) *
                        100,
                    )
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Low Attendance Alerts</Label>
                <p className="text-sm text-gray-600">Get notified when attendance drops below target</p>
              </div>
              <Switch
                checked={notifications.lowAttendance}
                onCheckedChange={(checked) => setNotifications({ ...notifications, lowAttendance: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Daily Reminders</Label>
                <p className="text-sm text-gray-600">Daily attendance tracking reminders</p>
              </div>
              <Switch
                checked={notifications.dailyReminder}
                onCheckedChange={(checked) => setNotifications({ ...notifications, dailyReminder: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Reports</Label>
                <p className="text-sm text-gray-600">Weekly attendance summary reports</p>
              </div>
              <Switch
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the app appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-gray-600">Choose light or dark theme</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Language</Label>
                <p className="text-sm text-gray-600">Select your preferred language</p>
              </div>
              <LanguageSelector />
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <Badge className="mr-2">New</Badge>
                AI Themes automatically adapt based on your performance and time of day!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>Import, export, or clear your attendance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              <div>
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-file" />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("import-file")?.click()}
                  className="flex items-center gap-2 w-full"
                >
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
              </div>
              <Button variant="destructive" onClick={handleClearData} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
