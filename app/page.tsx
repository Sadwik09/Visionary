"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { StudentDashboard } from "@/components/student-dashboard"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
  }

  return (
    <div>
      {isLoggedIn ? (
        <StudentDashboard onLogout={handleLogout} />
      ) : (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
