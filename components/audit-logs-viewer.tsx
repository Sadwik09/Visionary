"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Search, Calendar, User, Activity, Trash2, Eye } from "lucide-react"
import { auditLogger, type AuditLog } from "@/lib/audit-logger"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/hooks/use-auth"

export function AuditLogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterEntity, setFilterEntity] = useState("all")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statistics, setStatistics] = useState<any>(null)
  const { t } = useI18n()
  const { user } = useAuth()

  useEffect(() => {
    loadLogs()
    loadStatistics()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm, filterAction, filterEntity])

  const loadLogs = () => {
    const allLogs = auditLogger.getLogs(100) // Load last 100 logs
    setLogs(allLogs)
  }

  const loadStatistics = () => {
    const stats = auditLogger.getStatistics()
    setStatistics(stats)
  }

  const filterLogs = () => {
    let filtered = logs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.entityType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by action
    if (filterAction !== "all") {
      filtered = filtered.filter((log) => log.action === filterAction)
    }

    // Filter by entity type
    if (filterEntity !== "all") {
      filtered = filtered.filter((log) => log.entityType === filterEntity)
    }

    setFilteredLogs(filtered)
  }

  const exportLogs = (format: "json" | "csv") => {
    const exportData = auditLogger.exportLogs(format)
    const blob = new Blob([exportData], {
      type: format === "json" ? "application/json" : "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearLogs = () => {
    if (confirm("Are you sure you want to clear all audit logs? This action cannot be undone.")) {
      auditLogger.clearLogs()
      loadLogs()
      loadStatistics()
    }
  }

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "LOGIN":
      case "ADD_SUBJECT":
        return "default"
      case "UPDATE_ATTENDANCE":
      case "EDIT_SUBJECT":
      case "UPDATE_PROFILE":
        return "secondary"
      case "DELETE_SUBJECT":
      case "LOGOUT":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "subject":
        return "📚"
      case "attendance":
        return "✅"
      case "profile":
        return "👤"
      case "settings":
        return "⚙️"
      case "timetable":
        return "📅"
      default:
        return "📄"
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalLogs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Common Action</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.entries(statistics.actionCounts).sort(
                  ([, a], [, b]) => (b as number) - (a as number),
                )[0]?.[0] || "N/A"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entities Modified</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(statistics.entityCounts).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.recentActivity.length}</div>
              <p className="text-xs text-muted-foreground">Last 10 actions</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Track all changes and activities in your account</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportLogs("csv")}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportLogs("json")}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="destructive" size="sm" onClick={clearLogs}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Logs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="LOGOUT">Logout</SelectItem>
                <SelectItem value="UPDATE_ATTENDANCE">Update Attendance</SelectItem>
                <SelectItem value="ADD_SUBJECT">Add Subject</SelectItem>
                <SelectItem value="EDIT_SUBJECT">Edit Subject</SelectItem>
                <SelectItem value="DELETE_SUBJECT">Delete Subject</SelectItem>
                <SelectItem value="UPDATE_PROFILE">Update Profile</SelectItem>
                <SelectItem value="CHANGE_SETTINGS">Change Settings</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEntity} onValueChange={setFilterEntity}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="subject">Subject</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="profile">Profile</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="timetable">Timetable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Logs List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No audit logs found</p>
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div key={log.id}>
                    <div
                      className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getEntityIcon(log.entityType)}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getActionBadgeVariant(log.action)}>{log.action.replace("_", " ")}</Badge>
                            <span className="text-sm font-medium">{log.description}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatTimestamp(log.timestamp)} • {log.entityType}
                            {log.entityId && ` • ID: ${log.entityId}`}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    {index < filteredLogs.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Timestamp</label>
                  <p className="text-sm text-muted-foreground">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Action</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Entity Type</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.entityType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Entity ID</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.entityId || "N/A"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground">{selectedLog.description}</p>
              </div>

              {selectedLog.oldValue && (
                <div>
                  <label className="text-sm font-medium">Old Value</label>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                    {JSON.stringify(selectedLog.oldValue, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.newValue && (
                <div>
                  <label className="text-sm font-medium">New Value</label>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                    {JSON.stringify(selectedLog.newValue, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.userAgent && (
                <div>
                  <label className="text-sm font-medium">User Agent</label>
                  <p className="text-xs text-muted-foreground break-all">{selectedLog.userAgent}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
