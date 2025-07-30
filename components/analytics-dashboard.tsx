"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, Target } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AIPredictionEngine } from "@/lib/ai-predictions"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AnalyticsDashboard() {
  const { userData } = useAuth()

  if (!userData) return null

  const predictions = AIPredictionEngine.generatePredictions(userData.subjects)
  const insights = AIPredictionEngine.generateInsights(userData.subjects, userData.targetAttendance)

  // Generate mock weekly data for charts
  const weeklyData = [
    { week: "Week 1", attendance: 85 },
    { week: "Week 2", attendance: 78 },
    { week: "Week 3", attendance: 82 },
    { week: "Week 4", attendance: 88 },
    { week: "Week 5", attendance: 75 },
    { week: "Week 6", attendance: 90 },
  ]

  const subjectData = userData.subjects.map((subject) => ({
    name: subject.name,
    percentage: Math.round((subject.attended / subject.total) * 100),
    attended: subject.attended,
    total: subject.total,
  }))

  const riskDistribution = [
    { name: "Low Risk", value: predictions.filter((p) => p.riskLevel === "low").length, color: "#00C49F" },
    { name: "Medium Risk", value: predictions.filter((p) => p.riskLevel === "medium").length, color: "#FFBB28" },
    { name: "High Risk", value: predictions.filter((p) => p.riskLevel === "high").length, color: "#FF8042" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-gray-600">AI-powered insights and predictions for your attendance</p>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Performance Insights
          </CardTitle>
          <CardDescription>Personalized recommendations based on your attendance patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === "strength"
                    ? "bg-green-50 border-green-200"
                    : insight.type === "weakness"
                      ? "bg-red-50 border-red-200"
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {insight.type === "strength" && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {insight.type === "weakness" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                  {insight.type === "opportunity" && <Target className="w-4 h-4 text-blue-600" />}
                  <Badge
                    variant={
                      insight.type === "strength"
                        ? "default"
                        : insight.type === "weakness"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {insight.type}
                  </Badge>
                </div>
                <h4 className="font-medium mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <ul className="text-xs space-y-1">
                  {insight.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-gray-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>AI Attendance Predictions</CardTitle>
          <CardDescription>Projected attendance trends for each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.subjectId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{prediction.subjectName}</h4>
                    <Badge
                      variant={
                        prediction.riskLevel === "low"
                          ? "default"
                          : prediction.riskLevel === "medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {prediction.riskLevel} risk
                    </Badge>
                    <div className="flex items-center gap-1">
                      {prediction.trend === "improving" && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {prediction.trend === "declining" && <TrendingDown className="w-4 h-4 text-red-600" />}
                      <span className="text-sm text-gray-600 capitalize">{prediction.trend}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm">Current: {prediction.currentPercentage}%</span>
                    <span className="text-sm">Predicted: {prediction.predictedPercentage}%</span>
                  </div>
                  <Progress value={prediction.currentPercentage} className="mb-2" />
                  <p className="text-sm text-gray-600">{prediction.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
            <CardDescription>Your attendance percentage over the past 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
            <CardDescription>Attendance percentage by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Risk levels across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>Key statistics for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Classes Attended</span>
                <span className="text-2xl font-bold">{userData.subjects.reduce((sum, s) => sum + s.attended, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Classes</span>
                <span className="text-2xl font-bold">{userData.subjects.reduce((sum, s) => sum + s.total, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Percentage</span>
                <span className="text-2xl font-bold">
                  {Math.round(
                    (userData.subjects.reduce((sum, s) => sum + s.attended, 0) /
                      userData.subjects.reduce((sum, s) => sum + s.total, 0)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Subjects at Risk</span>
                <span className="text-2xl font-bold text-red-600">
                  {predictions.filter((p) => p.riskLevel === "high").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
