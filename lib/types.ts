export type ParsedMessage = {
  sender: string
  timestamp: Date
  message: string
}

export type ChatStats = {
  groupName: string
  totalMessages: number
  members: string[]
  topTexter: { name: string; count: number; percent: number }
  topWord: { word: string; count: number }
  messagesByHour: number[] // array of 24 numbers
  peakHour: number
  nightMessages: number
  leftOnRead: { name: string; count: number }
  mostDramatic: { name: string; count: number }
  // New stats
  emojiKing: { name: string; topEmoji: string; count: number }
  slowTexter: { name: string; avgMinutes: number }
  lurker: { name: string; count: number; percent: number }
  convoStarter: { name: string; count: number }
  // 2025 stats
  morningVsNight: {
    morningPerson: { name: string; morningCount: number; total: number }
    nightOwlPerson: { name: string; nightCount: number; total: number }
    groupMorningPct: number
    groupNightPct: number
  }
  longestStreak: { name: string; days: number; startDate: string }
  longestMessage: { name: string; length: number; preview: string; date: string }
}

export type Roasts = {
  introTagline: string
  totalMessagesRoast: string
  topTexterRoast: string
  topWordRoast: string
  nightOwlRoast: string
  leftOnReadRoast: string
  dramaticRoast: string
  finaleRoast: string
  // New roasts
  emojiKingRoast: string
  slowTexterRoast: string
  lurkerRoast: string
  convoStarterRoast: string
  // 2025 roasts
  morningVsNightRoast: string
  longestStreakRoast: string
  longestMessageRoast: string
  // AI features
  vibeCheckLabel: string   // one word: e.g. "CHAOTIC", "WHOLESOME"
  vibeCheckCaption: string // short roasty caption about the vibe
  compatPair: string       // "Name1 & Name2"
  compatScore: number      // 1-10
  compatReason: string     // why they'd survive on desert island
  compatWorstPair: string  // pair that would NOT survive
}
