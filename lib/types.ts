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
  nightMessages: number // messages between 12am-5am
  leftOnRead: { name: string; count: number }
  mostDramatic: { name: string; count: number }
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
}
