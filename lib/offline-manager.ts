"use client"

interface OfflineAction {
  id: string
  type: "attendance_update" | "subject_add" | "subject_edit" | "subject_delete" | "profile_update"
  data: any
  timestamp: number
  synced: boolean
}

interface SyncStatus {
  isOnline: boolean
  lastSync: number
  pendingActions: number
}

class OfflineManager {
  private static instance: OfflineManager
  private syncCallbacks: ((status: SyncStatus) => void)[] = []
  private isOnline = true
  private syncInProgress = false

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager()
    }
    return OfflineManager.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      this.isOnline = navigator.onLine
      window.addEventListener("online", this.handleOnline.bind(this))
      window.addEventListener("offline", this.handleOffline.bind(this))
    }
  }

  private handleOnline() {
    this.isOnline = true
    this.notifyStatusChange()
    this.syncPendingActions()
  }

  private handleOffline() {
    this.isOnline = false
    this.notifyStatusChange()
  }

  private notifyStatusChange() {
    const status = this.getSyncStatus()
    this.syncCallbacks.forEach((callback) => callback(status))
  }

  onSyncStatusChange(callback: (status: SyncStatus) => void) {
    this.syncCallbacks.push(callback)
    // Return unsubscribe function
    return () => {
      this.syncCallbacks = this.syncCallbacks.filter((cb) => cb !== callback)
    }
  }

  getSyncStatus(): SyncStatus {
    const pendingActions = this.getPendingActions()
    return {
      isOnline: this.isOnline,
      lastSync: this.getLastSyncTime(),
      pendingActions: pendingActions.length,
    }
  }

  private getLastSyncTime(): number {
    const lastSync = localStorage.getItem("lastSyncTime")
    return lastSync ? Number.parseInt(lastSync) : 0
  }

  private setLastSyncTime(timestamp: number) {
    localStorage.setItem("lastSyncTime", timestamp.toString())
  }

  addOfflineAction(type: OfflineAction["type"], data: any): string {
    const action: OfflineAction = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      synced: false,
    }

    const existingActions = this.getPendingActions()
    existingActions.push(action)
    localStorage.setItem("offlineActions", JSON.stringify(existingActions))

    this.notifyStatusChange()

    // If online, try to sync immediately
    if (this.isOnline) {
      this.syncPendingActions()
    }

    return action.id
  }

  private getPendingActions(): OfflineAction[] {
    const actions = localStorage.getItem("offlineActions")
    return actions ? JSON.parse(actions) : []
  }

  private setPendingActions(actions: OfflineAction[]) {
    localStorage.setItem("offlineActions", JSON.stringify(actions))
  }

  async syncPendingActions(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) return

    this.syncInProgress = true
    const pendingActions = this.getPendingActions()

    if (pendingActions.length === 0) {
      this.syncInProgress = false
      return
    }

    try {
      // Simulate API sync - in real app, this would call your backend
      await this.simulateSync(pendingActions)

      // Mark all actions as synced
      const syncedActions = pendingActions.map((action) => ({
        ...action,
        synced: true,
      }))

      // Remove synced actions (keep only unsynced ones)
      const remainingActions = syncedActions.filter((action) => !action.synced)
      this.setPendingActions(remainingActions)

      this.setLastSyncTime(Date.now())
      this.notifyStatusChange()
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async simulateSync(actions: OfflineAction[]): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would:
    // 1. Send actions to your backend API
    // 2. Handle conflicts and merge data
    // 3. Update local storage with server response

    console.log("Syncing actions:", actions)

    // For demo purposes, we'll just log the actions
    actions.forEach((action) => {
      console.log(`Synced ${action.type}:`, action.data)
    })
  }

  // Method to handle attendance updates offline
  updateAttendanceOffline(subjectId: number, isPresent: boolean, userData: any) {
    const updatedSubjects = userData.subjects.map((subject: any) => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          attended: subject.attended + (isPresent ? 1 : 0),
          total: subject.total + 1,
        }
      }
      return subject
    })

    // Save to local storage immediately
    const updatedUserData = { ...userData, subjects: updatedSubjects }
    localStorage.setItem("userData", JSON.stringify(updatedUserData))

    // Queue for sync when online
    this.addOfflineAction("attendance_update", {
      subjectId,
      isPresent,
      timestamp: Date.now(),
    })

    return updatedUserData
  }

  // Method to handle subject operations offline
  addSubjectOffline(subject: any, userData: any) {
    const updatedSubjects = [...userData.subjects, subject]
    const updatedUserData = { ...userData, subjects: updatedSubjects }

    localStorage.setItem("userData", JSON.stringify(updatedUserData))

    this.addOfflineAction("subject_add", subject)

    return updatedUserData
  }

  editSubjectOffline(subjectId: number, updatedSubject: any, userData: any) {
    const updatedSubjects = userData.subjects.map((subject: any) =>
      subject.id === subjectId ? updatedSubject : subject,
    )

    const updatedUserData = { ...userData, subjects: updatedSubjects }
    localStorage.setItem("userData", JSON.stringify(updatedUserData))

    this.addOfflineAction("subject_edit", { subjectId, updatedSubject })

    return updatedUserData
  }

  deleteSubjectOffline(subjectId: number, userData: any) {
    const updatedSubjects = userData.subjects.filter((subject: any) => subject.id !== subjectId)
    const updatedUserData = { ...userData, subjects: updatedSubjects }

    localStorage.setItem("userData", JSON.stringify(updatedUserData))

    this.addOfflineAction("subject_delete", { subjectId })

    return updatedUserData
  }
}

export const offlineManager = OfflineManager.getInstance()
