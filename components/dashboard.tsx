"use client"
import { StudentDashboard } from "./student-dashboard"
import { useAuth } from "@/hooks/use-auth"

export function Dashboard() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  if (!user) return null

  return <StudentDashboard onLogout={handleLogout} />
}
