"use client"

export interface VersionEntry {
  id: string
  timestamp: number
  userId: string
  action: "create" | "update" | "delete"
  entityType: "subject" | "attendance" | "timetable" | "profile"
  entityId: string | number
  snapshot: any
  description: string
  canRevert: boolean
}

class VersionHistoryManager {
  private static instance: VersionHistoryManager

  static getInstance(): VersionHistoryManager {
    if (!VersionHistoryManager.instance) {
      VersionHistoryManager.instance = new VersionHistoryManager()
    }
    return VersionHistoryManager.instance
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  saveVersion(
    userId: string,
    action: VersionEntry["action"],
    entityType: VersionEntry["entityType"],
    entityId: string | number,
    snapshot: any,
    description: string,
  ): string {
    const version: VersionEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      userId,
      action,
      entityType,
      entityId,
      snapshot: JSON.parse(JSON.stringify(snapshot)), // Deep clone
      description,
      canRevert: true,
    }

    const versions = this.getVersions(userId)
    versions.unshift(version) // Add to beginning

    // Keep only last 100 versions per user
    if (versions.length > 100) {
      versions.splice(100)
    }

    localStorage.setItem(`versions_${userId}`, JSON.stringify(versions))
    return version.id
  }

  getVersions(userId: string): VersionEntry[] {
    const stored = localStorage.getItem(`versions_${userId}`)
    return stored ? JSON.parse(stored) : []
  }

  getVersionsByEntity(
    userId: string,
    entityType: VersionEntry["entityType"],
    entityId: string | number,
  ): VersionEntry[] {
    const versions = this.getVersions(userId)
    return versions.filter((v) => v.entityType === entityType && v.entityId === entityId)
  }

  getVersion(userId: string, versionId: string): VersionEntry | null {
    const versions = this.getVersions(userId)
    return versions.find((v) => v.id === versionId) || null
  }

  revertToVersion(userId: string, versionId: string): any {
    const version = this.getVersion(userId, versionId)
    if (!version || !version.canRevert) {
      throw new Error("Cannot revert to this version")
    }

    // Create a new version entry for the revert action
    this.saveVersion(
      userId,
      "update",
      version.entityType,
      version.entityId,
      version.snapshot,
      `Reverted to version from ${new Date(version.timestamp).toLocaleString()}`,
    )

    return version.snapshot
  }

  compareVersions(version1: VersionEntry, version2: VersionEntry): any {
    // Simple diff implementation
    const diff = {
      added: {} as any,
      removed: {} as any,
      modified: {} as any,
    }

    const obj1 = version1.snapshot
    const obj2 = version2.snapshot

    // Find added and modified
    for (const key in obj2) {
      if (!(key in obj1)) {
        diff.added[key] = obj2[key]
      } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        diff.modified[key] = { from: obj1[key], to: obj2[key] }
      }
    }

    // Find removed
    for (const key in obj1) {
      if (!(key in obj2)) {
        diff.removed[key] = obj1[key]
      }
    }

    return diff
  }

  clearVersions(userId: string): void {
    localStorage.removeItem(`versions_${userId}`)
  }

  exportVersions(userId: string): string {
    const versions = this.getVersions(userId)
    return JSON.stringify(versions, null, 2)
  }
}

export const versionHistoryManager = VersionHistoryManager.getInstance()
