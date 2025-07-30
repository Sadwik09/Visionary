"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { History, RotateCcw, Eye, Clock, User } from "lucide-react"
import { versionHistoryManager, type VersionEntry } from "@/lib/version-history"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export function VersionHistoryViewer() {
  const [versions, setVersions] = useState<VersionEntry[]>([])
  const [selectedVersion, setSelectedVersion] = useState<VersionEntry | null>(null)
  const [compareVersion, setCompareVersion] = useState<VersionEntry | null>(null)
  const { user, updateUserData } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadVersions()
    }
  }, [user])

  const loadVersions = () => {
    if (!user) return
    const userVersions = versionHistoryManager.getVersions(user.username)
    setVersions(userVersions)
  }

  const handleRevert = async (versionId: string) => {
    if (!user) return

    try {
      const revertedData = versionHistoryManager.revertToVersion(user.username, versionId)

      // Update the user data based on entity type
      const version = versionHistoryManager.getVersion(user.username, versionId)
      if (version) {
        switch (version.entityType) {
          case "subject":
            updateUserData({ subjects: revertedData })
            break
          case "timetable":
            updateUserData({ timetable: revertedData })
            break
          case "profile":
            updateUserData({ profile: revertedData })
            break
        }
      }

      toast({
        title: "Reverted Successfully",
        description: "Data has been restored to the selected version",
      })

      loadVersions()
    } catch (error) {
      toast({
        title: "Revert Failed",
        description: "Could not revert to the selected version",
        variant: "destructive",
      })
    }
  }

  const getActionColor = (action: VersionEntry["action"]) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-800"
      case "update":
        return "bg-blue-100 text-blue-800"
      case "delete":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEntityIcon = (entityType: VersionEntry["entityType"]) => {
    switch (entityType) {
      case "subject":
        return "📚"
      case "attendance":
        return "✅"
      case "timetable":
        return "📅"
      case "profile":
        return "👤"
      default:
        return "📄"
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Version History
          </CardTitle>
          <CardDescription>Track and revert changes to your attendance data</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {versions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No version history available</p>
                </div>
              ) : (
                versions.map((version, index) => (
                  <div key={version.id}>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          {index < versions.length - 1 && <div className="w-px h-12 bg-border mt-2"></div>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getEntityIcon(version.entityType)}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className={getActionColor(version.action)}>{version.action.toUpperCase()}</Badge>
                              <span className="font-medium">{version.description}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimestamp(version.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {version.userId}
                              </span>
                              <span>{version.entityType}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedVersion(version)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Version Details</DialogTitle>
                            </DialogHeader>
                            {selectedVersion && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Timestamp</label>
                                    <p className="text-sm text-muted-foreground">
                                      {formatTimestamp(selectedVersion.timestamp)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Action</label>
                                    <p className="text-sm text-muted-foreground">{selectedVersion.action}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Entity Type</label>
                                    <p className="text-sm text-muted-foreground">{selectedVersion.entityType}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Entity ID</label>
                                    <p className="text-sm text-muted-foreground">{selectedVersion.entityId}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="text-sm text-muted-foreground">{selectedVersion.description}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Data Snapshot</label>
                                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-60">
                                    {JSON.stringify(selectedVersion.snapshot, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        {version.canRevert && (
                          <Button variant="outline" size="sm" onClick={() => handleRevert(version.id)}>
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Revert
                          </Button>
                        )}
                      </div>
                    </div>
                    {index < versions.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
