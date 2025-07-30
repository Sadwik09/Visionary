"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { RegisterModal } from "./register-modal"

interface LoginFormProps {
  onLoginSuccess: () => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    const success = login(username, password)
    if (success) {
      onLoginSuccess()
    } else {
      setError("Invalid username or password")
    }
  }

  const handleDemoLogin = () => {
    setUsername("student1")
    setPassword("student123")
    const success = login("student1", "student123")
    if (success) {
      onLoginSuccess()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Visionary</h1>
          <p className="mt-2 text-gray-600">Student Attendance Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button variant="outline" className="w-full bg-transparent" onClick={handleDemoLogin}>
              Demo Login
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Button variant="link" className="p-0 h-auto" onClick={() => setShowRegisterModal(true)}>
                Register
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Visionary. All rights reserved.
        </p>
      </div>

      <RegisterModal open={showRegisterModal} onOpenChange={setShowRegisterModal} />
    </div>
  )
}
