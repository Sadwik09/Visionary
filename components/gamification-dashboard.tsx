"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trophy, Star, Target, Flame, Award, Users } from "lucide-react"
import { gamificationEngine, type UserStats } from "@/lib/gamification"
import { useAuth } from "@/hooks/use-auth"

export function GamificationDashboard() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const { user, userData } = useAuth()

  useEffect(() => {
    if (user && userData) {
      const stats = gamificationEngine.updateStats(user.username, userData)
      setUserStats(stats)
      setLeaderboard(gamificationEngine.getLeaderboard())
    }
  }, [user, userData])

  if (!userStats) return null

  return (
    <div className="space-y-6">
      {/* Level and XP */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Level {userStats.level}
              </CardTitle>
              <CardDescription>
                {userStats.xp} / {userStats.xpToNextLevel} XP to next level
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{userStats.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(userStats.xp / userStats.xpToNextLevel) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.longestStreak}</div>
            <p className="text-xs text-muted-foreground">personal best</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.weeklyProgress}%</div>
            <Progress value={userStats.weeklyProgress} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Goal: {userStats.weeklyGoal}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Badges, Achievements, Leaderboard */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Badge Collection</CardTitle>
              <CardDescription>Unlock badges by achieving attendance milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userStats.badges.map((badge) => (
                  <Dialog key={badge.id}>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{badge.icon}</div>
                          <div className="font-medium text-sm">{badge.name}</div>
                          <Badge
                            variant="outline"
                            className={`mt-2 ${gamificationEngine.getRarityColor(badge.rarity)}`}
                          >
                            {badge.rarity}
                          </Badge>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <span className="text-2xl">{badge.icon}</span>
                          {badge.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>{badge.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={gamificationEngine.getRarityColor(badge.rarity)}>
                            {badge.rarity.toUpperCase()}
                          </Badge>
                          {badge.unlockedAt && (
                            <span className="text-sm text-muted-foreground">
                              Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.achievements.slice(0, 10).map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="w-8 h-8 text-yellow-500" />
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">+{achievement.points}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                {userStats.achievements.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No achievements yet. Keep attending classes to unlock your first achievement!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Class Leaderboard
              </CardTitle>
              <CardDescription>See how you rank among your peers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      entry.userId === user?.username ? "bg-primary/10 border-primary" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                                ? "bg-orange-500 text-white"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">
                          {entry.userId === user?.username ? "You" : `Student ${index + 1}`}
                        </div>
                        <div className="text-sm text-muted-foreground">Level {entry.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.xp} XP</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {entry.streak} streak
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
