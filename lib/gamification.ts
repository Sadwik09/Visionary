"use client"

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedAt?: number
  progress?: number
  maxProgress?: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  points: number
  unlockedAt: number
  category: "attendance" | "streak" | "improvement" | "special"
}

export interface UserStats {
  level: number
  xp: number
  xpToNextLevel: number
  currentStreak: number
  longestStreak: number
  totalPoints: number
  badges: Badge[]
  achievements: Achievement[]
  weeklyGoal: number
  weeklyProgress: number
}

class GamificationEngine {
  private static instance: GamificationEngine

  static getInstance(): GamificationEngine {
    if (!GamificationEngine.instance) {
      GamificationEngine.instance = new GamificationEngine()
    }
    return GamificationEngine.instance
  }

  private badges: Badge[] = [
    {
      id: "perfect_week",
      name: "Perfect Week",
      description: "100% attendance for a full week",
      icon: "🏆",
      rarity: "rare",
    },
    {
      id: "early_bird",
      name: "Early Bird",
      description: "Never missed a first period in a month",
      icon: "🌅",
      rarity: "common",
    },
    {
      id: "streak_master",
      name: "Streak Master",
      description: "Maintain 30-day attendance streak",
      icon: "🔥",
      rarity: "epic",
    },
    {
      id: "comeback_kid",
      name: "Comeback Kid",
      description: "Improved attendance by 20% in a month",
      icon: "📈",
      rarity: "rare",
    },
    {
      id: "perfect_month",
      name: "Perfect Month",
      description: "100% attendance for an entire month",
      icon: "💎",
      rarity: "legendary",
    },
    {
      id: "subject_champion",
      name: "Subject Champion",
      description: "Perfect attendance in a specific subject",
      icon: "🎯",
      rarity: "common",
    },
  ]

  getUserStats(userId: string): UserStats {
    const stored = localStorage.getItem(`gamification_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }

    return {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      badges: [],
      achievements: [],
      weeklyGoal: 90,
      weeklyProgress: 0,
    }
  }

  saveUserStats(userId: string, stats: UserStats) {
    localStorage.setItem(`gamification_${userId}`, JSON.stringify(stats))
  }

  calculateXP(attendancePercentage: number, streak: number): number {
    let xp = 0

    // Base XP for attendance
    if (attendancePercentage >= 95) xp += 50
    else if (attendancePercentage >= 85) xp += 30
    else if (attendancePercentage >= 75) xp += 15
    else xp += 5

    // Streak bonus
    xp += Math.min(streak * 2, 50)

    return xp
  }

  updateStats(userId: string, attendanceData: any): UserStats {
    const stats = this.getUserStats(userId)
    const oldLevel = stats.level

    // Calculate current streak
    const newStreak = this.calculateStreak(attendanceData)
    stats.currentStreak = newStreak
    stats.longestStreak = Math.max(stats.longestStreak, newStreak)

    // Calculate weekly progress
    const weeklyAttendance = this.calculateWeeklyAttendance(attendanceData)
    stats.weeklyProgress = weeklyAttendance

    // Award XP
    const xpGained = this.calculateXP(weeklyAttendance, newStreak)
    stats.xp += xpGained

    // Level up check
    while (stats.xp >= stats.xpToNextLevel) {
      stats.xp -= stats.xpToNextLevel
      stats.level++
      stats.xpToNextLevel = Math.floor(stats.xpToNextLevel * 1.2)
    }

    // Check for new badges and achievements
    this.checkBadges(stats, attendanceData)
    this.checkAchievements(stats, attendanceData, oldLevel)

    this.saveUserStats(userId, stats)
    return stats
  }

  private calculateStreak(attendanceData: any): number {
    // Mock calculation - in real app, analyze recent attendance
    return Math.floor(Math.random() * 15) + 1
  }

  private calculateWeeklyAttendance(attendanceData: any): number {
    if (!attendanceData?.subjects?.length) return 0

    const totalPeriods = attendanceData.subjects.reduce((sum: number, s: any) => sum + s.total, 0)
    const attendedPeriods = attendanceData.subjects.reduce((sum: number, s: any) => sum + s.attended, 0)

    return totalPeriods > 0 ? Math.round((attendedPeriods / totalPeriods) * 100) : 0
  }

  private checkBadges(stats: UserStats, attendanceData: any) {
    const weeklyAttendance = this.calculateWeeklyAttendance(attendanceData)

    this.badges.forEach((badge) => {
      const alreadyHas = stats.badges.find((b) => b.id === badge.id)
      if (alreadyHas) return

      let shouldUnlock = false

      switch (badge.id) {
        case "perfect_week":
          shouldUnlock = weeklyAttendance === 100
          break
        case "streak_master":
          shouldUnlock = stats.currentStreak >= 30
          break
        case "perfect_month":
          shouldUnlock = weeklyAttendance === 100 && stats.currentStreak >= 20
          break
        case "comeback_kid":
          shouldUnlock = weeklyAttendance > 80 // Simplified check
          break
        case "early_bird":
          shouldUnlock = stats.currentStreak >= 7
          break
        case "subject_champion":
          shouldUnlock = attendanceData?.subjects?.some((s: any) => s.total > 0 && s.attended / s.total === 1)
          break
      }

      if (shouldUnlock) {
        stats.badges.push({
          ...badge,
          unlockedAt: Date.now(),
        })
      }
    })
  }

  private checkAchievements(stats: UserStats, attendanceData: any, oldLevel: number) {
    // Level up achievement
    if (stats.level > oldLevel) {
      stats.achievements.push({
        id: `level_${stats.level}`,
        title: `Level ${stats.level} Reached!`,
        description: `You've reached level ${stats.level}`,
        points: stats.level * 10,
        unlockedAt: Date.now(),
        category: "special",
      })
    }

    // Streak achievements
    if (stats.currentStreak === 7) {
      stats.achievements.push({
        id: "week_streak",
        title: "Week Warrior",
        description: "7-day attendance streak",
        points: 50,
        unlockedAt: Date.now(),
        category: "streak",
      })
    }
  }

  getLeaderboard(): Array<{ userId: string; level: number; xp: number; streak: number }> {
    // Mock leaderboard data
    return [
      { userId: "student1", level: 5, xp: 1250, streak: 15 },
      { userId: "student2", level: 4, xp: 980, streak: 12 },
      { userId: "student3", level: 4, xp: 850, streak: 8 },
      { userId: "student4", level: 3, xp: 720, streak: 5 },
      { userId: "student5", level: 3, xp: 650, streak: 3 },
    ]
  }

  getRarityColor(rarity: Badge["rarity"]): string {
    switch (rarity) {
      case "common":
        return "text-gray-600"
      case "rare":
        return "text-blue-600"
      case "epic":
        return "text-purple-600"
      case "legendary":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }
}

export const gamificationEngine = GamificationEngine.getInstance()
