"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Subject {
  id: string
  name: string
  attended: number
  total: number
}

interface TimetableEntry {
  id: string
  day: string
  time: string
  subject: string
  room?: string
  teacher?: string
}

interface UserData {
  name: string
  email: string
  studentId: string
  class: string
  targetAttendance: number
  subjects: Subject[]
  timetable?: TimetableEntry[]
}

interface User {
  username: string
  userType: "student"
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  login: (username: string, password: string) => boolean
  logout: () => void
  updateUserData: (data: UserData) => void
  addSubject: (subject: Subject) => void
  updateSubject: (subject: Subject) => void
  deleteSubject: (subjectId: string) => void
  updateTimetable: (entry: TimetableEntry) => void
  deleteTimetableEntry: (entryId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_CREDENTIALS = {
  student1: { password: "student123", userType: "student" as const },
}

const DEMO_USER_DATA: UserData = {
  name: "John Smith",
  email: "john.smith@university.edu",
  studentId: "STU001",
  class: "Computer Science - Year 3",
  targetAttendance: 75,
  subjects: [
    { id: "1", name: "Mathematics", attended: 18, total: 20 },
    { id: "2", name: "Physics", attended: 15, total: 18 },
    { id: "3", name: "Chemistry", attended: 12, total: 16 },
    { id: "4", name: "Computer Science", attended: 22, total: 24 },
    { id: "5", name: "English", attended: 14, total: 20 },
  ],
  timetable: [
    { id: "t1", day: "Monday", time: "9:00 AM", subject: "Mathematics", room: "Room 101", teacher: "Dr. Johnson" },
    { id: "t2", day: "Monday", time: "11:00 AM", subject: "Physics", room: "Lab 201", teacher: "Prof. Wilson" },
    { id: "t3", day: "Tuesday", time: "10:00 AM", subject: "Chemistry", room: "Lab 301", teacher: "Dr. Brown" },
    {
      id: "t4",
      day: "Tuesday",
      time: "2:00 PM",
      subject: "Computer Science",
      room: "Room 401",
      teacher: "Prof. Davis",
    },
    { id: "t5", day: "Wednesday", time: "9:00 AM", subject: "English", room: "Room 102", teacher: "Ms. Taylor" },
    { id: "t6", day: "Wednesday", time: "1:00 PM", subject: "Mathematics", room: "Room 101", teacher: "Dr. Johnson" },
    { id: "t7", day: "Thursday", time: "10:00 AM", subject: "Physics", room: "Lab 201", teacher: "Prof. Wilson" },
    {
      id: "t8",
      day: "Thursday",
      time: "3:00 PM",
      subject: "Computer Science",
      room: "Room 401",
      teacher: "Prof. Davis",
    },
    { id: "t9", day: "Friday", time: "11:00 AM", subject: "Chemistry", room: "Lab 301", teacher: "Dr. Brown" },
    { id: "t10", day: "Friday", time: "2:00 PM", subject: "English", room: "Room 102", teacher: "Ms. Taylor" },
  ],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    const savedUserData = localStorage.getItem("userData")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedUserData) {
      setUserData(JSON.parse(savedUserData))
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const credentials = DEMO_CREDENTIALS[username as keyof typeof DEMO_CREDENTIALS]

    if (credentials && credentials.password === password) {
      const newUser: User = {
        username,
        userType: credentials.userType,
      }

      setUser(newUser)
      setUserData(DEMO_USER_DATA)

      localStorage.setItem("currentUser", JSON.stringify(newUser))
      localStorage.setItem("userData", JSON.stringify(DEMO_USER_DATA))

      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    setUserData(null)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userData")
  }

  const updateUserData = (data: UserData) => {
    setUserData(data)
    localStorage.setItem("userData", JSON.stringify(data))
  }

  const addSubject = (subject: Subject) => {
    if (userData) {
      const updatedData = {
        ...userData,
        subjects: [...userData.subjects, subject],
      }
      updateUserData(updatedData)
    }
  }

  const updateSubject = (updatedSubject: Subject) => {
    if (userData) {
      const updatedData = {
        ...userData,
        subjects: userData.subjects.map((subject) => (subject.id === updatedSubject.id ? updatedSubject : subject)),
      }
      updateUserData(updatedData)
    }
  }

  const deleteSubject = (subjectId: string) => {
    if (userData) {
      const updatedData = {
        ...userData,
        subjects: userData.subjects.filter((subject) => subject.id !== subjectId),
      }
      updateUserData(updatedData)
    }
  }

  const updateTimetable = (entry: TimetableEntry) => {
    if (userData) {
      const existingEntries = userData.timetable || []
      const existingIndex = existingEntries.findIndex((e) => e.id === entry.id)

      let updatedTimetable
      if (existingIndex >= 0) {
        updatedTimetable = existingEntries.map((e) => (e.id === entry.id ? entry : e))
      } else {
        updatedTimetable = [...existingEntries, entry]
      }

      const updatedData = {
        ...userData,
        timetable: updatedTimetable,
      }
      updateUserData(updatedData)
    }
  }

  const deleteTimetableEntry = (entryId: string) => {
    if (userData) {
      const updatedData = {
        ...userData,
        timetable: (userData.timetable || []).filter((entry) => entry.id !== entryId),
      }
      updateUserData(updatedData)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        login,
        logout,
        updateUserData,
        addSubject,
        updateSubject,
        deleteSubject,
        updateTimetable,
        deleteTimetableEntry,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
