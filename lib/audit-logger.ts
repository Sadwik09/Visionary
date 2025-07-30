"use client"

export interface AuditLog {
  id: string
  timestamp: number
  userId: string
  action: string
  entityType: "subject" | "attendance" | "profile" | "settings" | "timetable"
  entityId?: string | number
  oldValue?: any
  newValue?: any
  description: string
  ipAddress?: string
  userAgent?: string
}

class AuditLogger {
  private static instance: AuditLogger
  private logs: AuditLog[] = []

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  constructor() {
    this.loadLogs()
  }

  private loadLogs() {
    const storedLogs = localStorage.getItem("auditLogs")
    if (storedLogs) {
      this.logs = JSON.parse(storedLogs)
    }
  }

  private saveLogs() {
    localStorage.setItem("auditLogs", JSON.stringify(this.logs))
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  log(
    userId: string,
    action: string,
    entityType: AuditLog["entityType"],
    description: string,
    entityId?: string | number,
    oldValue?: any,
    newValue?: any,
  ) {
    const auditLog: AuditLog = {
      id: this.generateId(),
      timestamp: Date.now(),
      userId,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      description,
      userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
    }

    this.logs.unshift(auditLog) // Add to beginning for chronological order

    // Keep only last 1000 logs to prevent storage bloat
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000)
    }

    this.saveLogs()
  }

  // Specific logging methods for different actions
  logAttendanceUpdate(
    userId: string,
    subjectId: number,
    subjectName: string,
    isPresent: boolean,
    oldAttended: number,
    newAttended: number,
    oldTotal: number,
    newTotal: number,
  ) {
    this.log(
      userId,
      "UPDATE_ATTENDANCE",
      "attendance",
      `Marked ${isPresent ? "present" : "absent"} for ${subjectName}`,
      subjectId,
      { attended: oldAttended, total: oldTotal },
      { attended: newAttended, total: newTotal },
    )
  }

  logSubjectAdd(userId: string, subject: any) {
    this.log(userId, "ADD_SUBJECT", "subject", `Added new subject: ${subject.name}`, subject.id, null, subject)
  }

  logSubjectEdit(userId: string, subjectId: number, oldSubject: any, newSubject: any) {
    this.log(userId, "EDIT_SUBJECT", "subject", `Edited subject: ${newSubject.name}`, subjectId, oldSubject, newSubject)
  }

  logSubjectDelete(userId: string, subjectId: number, subjectName: string) {
    this.log(
      userId,
      "DELETE_SUBJECT",
      "subject",
      `Deleted subject: ${subjectName}`,
      subjectId,
      { name: subjectName },
      null,
    )
  }

  logProfileUpdate(userId: string, oldProfile: any, newProfile: any) {
    this.log(userId, "UPDATE_PROFILE", "profile", "Updated profile information", userId, oldProfile, newProfile)
  }

  logSettingsChange(userId: string, setting: string, oldValue: any, newValue: any) {
    this.log(userId, "CHANGE_SETTINGS", "settings", `Changed ${setting} setting`, setting, oldValue, newValue)
  }

  logTimetableUpdate(userId: string, day: string, action: string, periodData?: any) {
    this.log(
      userId,
      "UPDATE_TIMETABLE",
      "timetable",
      `${action} period on ${day}`,
      `${day}-${Date.now()}`,
      null,
      periodData,
    )
  }

  logLogin(userId: string) {
    this.log(userId, "LOGIN", "profile", "User logged in", userId)
  }

  logLogout(userId: string) {
    this.log(userId, "LOGOUT", "profile", "User logged out", userId)
  }

  // Query methods
  getLogs(limit?: number): AuditLog[] {
    return limit ? this.logs.slice(0, limit) : this.logs
  }

  getLogsByUser(userId: string, limit?: number): AuditLog[] {
    const userLogs = this.logs.filter((log) => log.userId === userId)
    return limit ? userLogs.slice(0, limit) : userLogs
  }

  getLogsByEntity(entityType: AuditLog["entityType"], entityId?: string | number): AuditLog[] {
    return this.logs.filter((log) => log.entityType === entityType && (entityId ? log.entityId === entityId : true))
  }

  getLogsByAction(action: string): AuditLog[] {
    return this.logs.filter((log) => log.action === action)
  }

  getLogsByDateRange(startDate: Date, endDate: Date): AuditLog[] {
    const start = startDate.getTime()
    const end = endDate.getTime()
    return this.logs.filter((log) => log.timestamp >= start && log.timestamp <= end)
  }

  // Export logs
  exportLogs(format: "json" | "csv" = "json"): string {
    if (format === "csv") {
      const headers = [
        "ID",
        "Timestamp",
        "User ID",
        "Action",
        "Entity Type",
        "Entity ID",
        "Description",
        "Old Value",
        "New Value",
      ]
      const csvRows = [
        headers.join(","),
        ...this.logs.map((log) =>
          [
            log.id,
            new Date(log.timestamp).toISOString(),
            log.userId,
            log.action,
            log.entityType,
            log.entityId || "",
            `"${log.description}"`,
            log.oldValue ? `"${JSON.stringify(log.oldValue)}"` : "",
            log.newValue ? `"${JSON.stringify(log.newValue)}"` : "",
          ].join(","),
        ),
      ]
      return csvRows.join("\n")
    }

    return JSON.stringify(this.logs, null, 2)
  }

  // Clear logs (with confirmation)
  clearLogs(): void {
    this.logs = []
    this.saveLogs()
  }

  // Get statistics
  getStatistics() {
    const totalLogs = this.logs.length
    const actionCounts = this.logs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const entityCounts = this.logs.reduce(
      (acc, log) => {
        acc[log.entityType] = (acc[log.entityType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const recentActivity = this.logs.slice(0, 10)

    return {
      totalLogs,
      actionCounts,
      entityCounts,
      recentActivity,
    }
  }
}

export const auditLogger = AuditLogger.getInstance()
