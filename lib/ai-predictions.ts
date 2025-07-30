export interface AttendancePrediction {
  subjectId: string
  subjectName: string
  currentPercentage: number
  predictedPercentage: number
  trend: "improving" | "declining" | "stable"
  recommendation: string
  riskLevel: "low" | "medium" | "high"
}

export interface PerformanceInsight {
  type: "strength" | "weakness" | "opportunity"
  title: string
  description: string
  actionItems: string[]
}

export class AIPredictionEngine {
  static generatePredictions(subjects: any[]): AttendancePrediction[] {
    return subjects.map((subject) => {
      const currentPercentage = Math.round((subject.attended / subject.total) * 100)

      // Simple prediction algorithm based on recent trends
      const recentTrend = this.calculateTrend(subject)
      const predictedPercentage = Math.max(0, Math.min(100, currentPercentage + recentTrend))

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        currentPercentage,
        predictedPercentage,
        trend: this.getTrendCategory(recentTrend),
        recommendation: this.generateRecommendation(currentPercentage, recentTrend),
        riskLevel: this.assessRiskLevel(currentPercentage, recentTrend),
      }
    })
  }

  static generateInsights(subjects: any[], targetAttendance: number): PerformanceInsight[] {
    const insights: PerformanceInsight[] = []

    // Find strongest subject
    const strongestSubject = subjects.reduce((prev, current) =>
      current.attended / current.total > prev.attended / prev.total ? current : prev,
    )

    insights.push({
      type: "strength",
      title: `Excellent performance in ${strongestSubject.name}`,
      description: `You're maintaining ${Math.round((strongestSubject.attended / strongestSubject.total) * 100)}% attendance`,
      actionItems: ["Keep up the consistent attendance", "Help peers who might be struggling"],
    })

    // Find weakest subject
    const weakestSubject = subjects.reduce((prev, current) =>
      current.attended / current.total < prev.attended / prev.total ? current : prev,
    )

    if ((weakestSubject.attended / weakestSubject.total) * 100 < targetAttendance) {
      insights.push({
        type: "weakness",
        title: `${weakestSubject.name} needs attention`,
        description: `Current attendance is ${Math.round((weakestSubject.attended / weakestSubject.total) * 100)}%, below your ${targetAttendance}% target`,
        actionItems: [
          "Set reminders for this subject",
          "Review class schedule conflicts",
          "Speak with the instructor about catch-up options",
        ],
      })
    }

    // Overall opportunity
    const overallPercentage = Math.round(
      (subjects.reduce((sum, s) => sum + s.attended, 0) / subjects.reduce((sum, s) => sum + s.total, 0)) * 100,
    )

    if (overallPercentage < targetAttendance) {
      insights.push({
        type: "opportunity",
        title: "Opportunity to improve overall attendance",
        description: `You're ${targetAttendance - overallPercentage}% away from your target`,
        actionItems: [
          "Focus on consistent daily attendance",
          "Use the timetable feature for better planning",
          "Set up attendance reminders",
        ],
      })
    }

    return insights
  }

  private static calculateTrend(subject: any): number {
    // Simplified trend calculation
    // In a real app, this would analyze historical data
    const randomFactor = (Math.random() - 0.5) * 10
    const currentPercentage = (subject.attended / subject.total) * 100

    if (currentPercentage > 85) return randomFactor * 0.5 // Stable when high
    if (currentPercentage < 60) return Math.abs(randomFactor) * 0.8 // Improving when low
    return randomFactor * 0.7 // Variable in middle range
  }

  private static getTrendCategory(trend: number): "improving" | "declining" | "stable" {
    if (trend > 2) return "improving"
    if (trend < -2) return "declining"
    return "stable"
  }

  private static generateRecommendation(currentPercentage: number, trend: number): string {
    if (currentPercentage >= 90) {
      return "Excellent attendance! Keep up the great work."
    } else if (currentPercentage >= 75) {
      if (trend < 0) return "Good attendance, but watch for declining trend. Stay consistent."
      return "Good attendance. Consider aiming for 90%+ for excellence."
    } else if (currentPercentage >= 60) {
      return "Attendance needs improvement. Focus on attending more classes to reach your target."
    } else {
      return "Critical: Attendance is very low. Immediate action needed to avoid academic issues."
    }
  }

  private static assessRiskLevel(currentPercentage: number, trend: number): "low" | "medium" | "high" {
    if (currentPercentage < 60) return "high"
    if (currentPercentage < 75 || trend < -5) return "medium"
    return "low"
  }
}
