"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Wifi, WifiOff, RefreshCw, Clock, CheckCircle } from "lucide-react"
import { offlineManager } from "@/lib/offline-manager"
import { useI18n } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

interface SyncStatus {
  isOnline: boolean
  lastSync: number
  pendingActions: number
}

export function OfflineIndicator() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSync: 0,
    pendingActions: 0,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const { t } = useI18n()
  const { toast } = useToast()

  useEffect(() => {
    // Initial status
    setSyncStatus(offlineManager.getSyncStatus())

    // Subscribe to status changes
    const unsubscribe = offlineManager.onSyncStatusChange((status) => {
      setSyncStatus(status)

      // Show toast when going offline/online
      if (!status.isOnline) {
        toast({
          title: t("status.offline"),
          description: "Changes will be saved locally and synced when online",
          variant: "destructive",
        })
      } else if (status.isOnline && status.pendingActions > 0) {
        toast({
          title: t("status.online"),
          description: t("message.syncing"),
        })
      }
    })

    return unsubscribe
  }, [t, toast])

  const handleManualSync = async () => {
    setIsSyncing(true)
    try {
      await offlineManager.syncPendingActions()
      toast({
        title: t("message.success"),
        description: t("message.syncComplete"),
      })
    } catch (error) {
      toast({
        title: t("message.error"),
        description: "Failed to sync data",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const formatLastSync = (timestamp: number) => {
    if (timestamp === 0) return "Never"
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {syncStatus.isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          {syncStatus.pendingActions > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {syncStatus.pendingActions}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            Sync Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connection Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={syncStatus.isOnline ? "default" : "destructive"}>
                  {syncStatus.isOnline ? t("status.online") : t("status.offline")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pending Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unsynced actions</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{syncStatus.pendingActions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Sync */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Last Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{formatLastSync(syncStatus.lastSync)}</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Manual Sync Button */}
          {syncStatus.isOnline && syncStatus.pendingActions > 0 && (
            <Button onClick={handleManualSync} disabled={isSyncing} className="w-full">
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
          )}

          {/* Offline Mode Info */}
          {!syncStatus.isOnline && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
              <CardContent className="pt-4">
                <CardDescription className="text-orange-800 dark:text-orange-200">
                  You're currently offline. All changes are being saved locally and will sync automatically when you're
                  back online.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
