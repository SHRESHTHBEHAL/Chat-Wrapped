import { ParsedMessage, ChatStats } from "./types"

// Catch all WhatsApp "<X omitted>" variants
const OMITTED_REGEX = /<?(?:media|image|video|audio|sticker|gif|document|contact|file)\s+omitted>?/i

const STOPWORDS = new Set([
  "the","a","is","to","and","i","you","it","in","of","that","was","for","on",
  "are","at","be","this","with","but","not","have","had","they","he","she","we",
  "so","if","my","your","just","me","do","its","no","up","get","can","been",
  "has","or","an","his","her","out","im","dont","ok","yeah","yes","like","got",
  "will","from","about","what","know","think","going","want","one","more","also",
  "would","could","should","time","day","then","than","there","so","all","as",
  "by","oh","lol","haha","hahaha","okay","na","la","yah","nah","ah","eh","lah",
  // WhatsApp export noise words
  "omitted","media","message","deleted","null","image","video","audio","sticker","gif","document","contact",
])

// Regex to match emoji characters (Unicode ranges for common emoji blocks)
function extractEmojis(text: string): string[] {
  const emojiRegex = /[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2764}❤️🤍🖤🤎🤖]+/gu
  return text.match(emojiRegex) ?? []
}

export function calculateStats(messages: ParsedMessage[], groupName: string): ChatStats {
  // Filter out messages where the sender matches the group name (WhatsApp system notifications).
  // Only do this if there are other real senders — in a 1:1 chat the "group name" may be a person.
  const groupLower = groupName.toLowerCase()
  const uniqueSenders = new Set(messages.map((m) => m.sender))
  const groupNameIsSender = [...uniqueSenders].some((s) => s.toLowerCase() === groupLower)
  if (groupNameIsSender && uniqueSenders.size > 2) {
    messages = messages.filter((m) => m.sender.toLowerCase() !== groupLower)
  }

  if (!messages.length) {
    return {
      groupName,
      totalMessages: 0,
      members: [],
      topTexter: { name: "Unknown", count: 0, percent: 0 },
      topWord: { word: "nothing", count: 0 },
      messagesByHour: new Array(24).fill(0),
      peakHour: 0,
      nightMessages: 0,
      leftOnRead: { name: "Unknown", count: 0 },
      mostDramatic: { name: "Unknown", count: 0 },
      emojiKing: { name: "Unknown", topEmoji: "😂", count: 0 },
      slowTexter: { name: "Unknown", avgMinutes: 0 },
      lurker: { name: "Unknown", count: 0, percent: 0 },
      convoStarter: { name: "Unknown", count: 0 },
      morningVsNight: {
        morningPerson: { name: "Unknown", morningCount: 0, total: 0 },
        nightOwlPerson: { name: "Unknown", nightCount: 0, total: 0 },
        groupMorningPct: 50,
        groupNightPct: 50,
      },
      longestStreak: { name: "Unknown", days: 0, startDate: "" },
      longestMessage: { name: "Unknown", length: 0, preview: "", date: "" },
    }
  }

  // Message counts per sender
  const senderCounts: Record<string, number> = {}
  for (const m of messages) {
    senderCounts[m.sender] = (senderCounts[m.sender] || 0) + 1
  }

  const members = Object.keys(senderCounts)
  const totalMessages = messages.length

  // Top texter
  const topTexterName = members.reduce((a, b) => senderCounts[a] >= senderCounts[b] ? a : b)
  const topTexterCount = senderCounts[topTexterName]
  const topTexterPercent = Math.round((topTexterCount / totalMessages) * 100)

  // Word frequency (excluding stopwords)
  const wordCounts: Record<string, number> = {}
  for (const m of messages) {
    const words = m.message
      .toLowerCase()
      .replace(/<[^>]*>/g, " ")                    // strip <Media omitted> style tokens
      .replace(/\w+\s+omitted/g, " ")              // strip "media omitted", "image omitted", etc. without brackets
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
    for (const w of words) {
      if (w.length <= 1) continue
      if (STOPWORDS.has(w)) continue
      wordCounts[w] = (wordCounts[w] || 0) + 1
    }
  }
  let topWordStr = "chat"
  let topWordCount = 0
  for (const [word, count] of Object.entries(wordCounts)) {
    if (count > topWordCount) {
      topWordCount = count
      topWordStr = word
    }
  }

  // Messages by hour
  const messagesByHour = new Array(24).fill(0)
  for (const m of messages) {
    const h = m.timestamp.getHours()
    if (h >= 0 && h < 24) messagesByHour[h]++
  }

  const peakHour = messagesByHour.indexOf(Math.max(...messagesByHour))
  const nightMessages = messagesByHour.slice(0, 5).reduce((a, b) => a + b, 0)

  // Left on read — count streaks where same sender sent 2+ uninterrupted
  const streakCounts: Record<string, number> = {}
  let si = 0
  while (si < messages.length) {
    const sender = messages[si].sender
    let sj = si + 1
    while (sj < messages.length && messages[sj].sender === sender) sj++
    if (sj - si >= 2) {
      streakCounts[sender] = (streakCounts[sender] || 0) + 1
    }
    si = sj
  }

  let leftOnReadName = members[0] || "Unknown"
  let leftOnReadCount = 0
  for (const [name, count] of Object.entries(streakCounts)) {
    if (count > leftOnReadCount) {
      leftOnReadCount = count
      leftOnReadName = name
    }
  }

  // Most dramatic — count ! and ? usage
  const dramaCounts: Record<string, number> = {}
  for (const m of messages) {
    const marks = (m.message.match(/[!?]/g) || []).length
    if (marks > 0) {
      dramaCounts[m.sender] = (dramaCounts[m.sender] || 0) + marks
    }
  }
  let mostDramaticName = members[0] || "Unknown"
  let mostDramaticCount = 0
  for (const [name, count] of Object.entries(dramaCounts)) {
    if (count > mostDramaticCount) {
      mostDramaticCount = count
      mostDramaticName = name
    }
  }

  // ===== NEW STATS =====

  // Emoji King — per sender: count all emojis and track which emoji is most used
  const emojiCountsBySender: Record<string, number> = {}
  const globalEmojiFreq: Record<string, number> = {}
  const senderTopEmoji: Record<string, Record<string, number>> = {}

  for (const m of messages) {
    const emojis = extractEmojis(m.message)
    for (const emoji of emojis) {
      emojiCountsBySender[m.sender] = (emojiCountsBySender[m.sender] || 0) + 1
      globalEmojiFreq[emoji] = (globalEmojiFreq[emoji] || 0) + 1
      if (!senderTopEmoji[m.sender]) senderTopEmoji[m.sender] = {}
      senderTopEmoji[m.sender][emoji] = (senderTopEmoji[m.sender][emoji] || 0) + 1
    }
  }

  let emojiKingName = members[0] || "Unknown"
  let emojiKingCount = 0
  for (const [name, count] of Object.entries(emojiCountsBySender)) {
    if (count > emojiKingCount) {
      emojiKingCount = count
      emojiKingName = name
    }
  }
  // Top emoji for the emoji king
  const kingEmojiMap = senderTopEmoji[emojiKingName] || {}
  let kingTopEmoji = "😂"
  let kingTopEmojiCount = 0
  for (const [emoji, count] of Object.entries(kingEmojiMap)) {
    if (count > kingTopEmojiCount) {
      kingTopEmojiCount = count
      kingTopEmoji = emoji
    }
  }

  // Reply Speed — average gap in minutes between someone's message and the next person's reply
  const replyGaps: Record<string, number[]> = {}
  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1]
    const curr = messages[i]
    if (curr.sender !== prev.sender) {
      const gapMs = curr.timestamp.getTime() - prev.timestamp.getTime()
      const gapMins = gapMs / 60000
      // Ignore gaps > 12 hours (they were probably just offline)
      if (gapMins > 0 && gapMins < 720) {
        if (!replyGaps[curr.sender]) replyGaps[curr.sender] = []
        replyGaps[curr.sender].push(gapMins)
      }
    }
  }

  let slowTexterName = members[0] || "Unknown"
  let slowTexterAvg = 0
  for (const [name, gaps] of Object.entries(replyGaps)) {
    if (gaps.length < 3) continue // need at least 3 replies to be meaningful
    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length
    if (avg > slowTexterAvg) {
      slowTexterAvg = avg
      slowTexterName = name
    }
  }

  // Lurker — lowest message count (% of chat)
  const lurkerName = members.reduce((a, b) => senderCounts[a] <= senderCounts[b] ? a : b)
  const lurkerCount = senderCounts[lurkerName]
  const lurkerPercent = Math.round((lurkerCount / totalMessages) * 100)

  // Conversation Starter — who sends the first message after 60+ min silence
  const convoStartCounts: Record<string, number> = {}
  for (let i = 1; i < messages.length; i++) {
    const gapMs = messages[i].timestamp.getTime() - messages[i - 1].timestamp.getTime()
    const gapMins = gapMs / 60000
    if (gapMins >= 60) {
      const starter = messages[i].sender
      convoStartCounts[starter] = (convoStartCounts[starter] || 0) + 1
    }
  }
  // First message starts the first convo
  if (messages[0]) {
    convoStartCounts[messages[0].sender] = (convoStartCounts[messages[0].sender] || 0) + 1
  }

  let convoStarterName = members[0] || "Unknown"
  let convoStarterCount = 0
  for (const [name, count] of Object.entries(convoStartCounts)) {
    if (count > convoStarterCount) {
      convoStarterCount = count
      convoStarterName = name
    }
  }

  // ===== 2025 STATS =====

  // Morning vs Night — morning = 5-11, night = 21-4
  // Per-sender counts, then find the most morning-skewed and most night-skewed
  const morningCounts: Record<string, number> = {}
  const nightCounts: Record<string, number> = {}
  let groupMorning = 0
  let groupNight = 0

  for (const m of messages) {
    const h = m.timestamp.getHours()
    const isMorning = h >= 5 && h <= 11
    const isNight = h >= 21 || h <= 4
    if (isMorning) {
      morningCounts[m.sender] = (morningCounts[m.sender] || 0) + 1
      groupMorning++
    }
    if (isNight) {
      nightCounts[m.sender] = (nightCounts[m.sender] || 0) + 1
      groupNight++
    }
  }

  // Best morning person: highest (morningCount / senderTotal) ratio
  let morningPersonName = members[0] || "Unknown"
  let morningPersonRatio = -1
  let morningPersonMorning = 0
  for (const name of members) {
    const mc = morningCounts[name] || 0
    const total = senderCounts[name] || 1
    const ratio = mc / total
    if (ratio > morningPersonRatio) {
      morningPersonRatio = ratio
      morningPersonName = name
      morningPersonMorning = mc
    }
  }

  // Best night owl: highest (nightCount / senderTotal) ratio
  let nightOwlPersonName = members[0] || "Unknown"
  let nightOwlPersonRatio = -1
  let nightOwlPersonNight = 0
  for (const name of members) {
    const nc = nightCounts[name] || 0
    const total = senderCounts[name] || 1
    const ratio = nc / total
    if (ratio > nightOwlPersonRatio) {
      nightOwlPersonRatio = ratio
      nightOwlPersonName = name
      nightOwlPersonNight = nc
    }
  }

  const morningNightTotal = groupMorning + groupNight || 1
  const groupMorningPct = Math.round((groupMorning / morningNightTotal) * 100)
  const groupNightPct = 100 - groupMorningPct

  // Longest streak — consecutive calendar days where a sender sent at least one message
  // Build per-sender set of day-strings, then find longest consecutive run
  const senderDays: Record<string, Set<string>> = {}
  for (const m of messages) {
    const d = m.timestamp
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!senderDays[m.sender]) senderDays[m.sender] = new Set()
    senderDays[m.sender].add(key)
  }

  function longestConsecutiveDays(daySet: Set<string>): { days: number; startDate: string } {
    if (!daySet.size) return { days: 0, startDate: "" }
    // Convert to sorted Date objects
    const sorted = Array.from(daySet)
      .map((s) => {
        const [y, mo, d] = s.split("-").map(Number)
        return new Date(y, mo, d)
      })
      .sort((a, b) => a.getTime() - b.getTime())

    let best = 1
    let bestStart = sorted[0]
    let cur = 1
    let curStart = sorted[0]

    for (let i = 1; i < sorted.length; i++) {
      const diffMs = sorted[i].getTime() - sorted[i - 1].getTime()
      const diffDays = Math.round(diffMs / 86400000)
      if (diffDays === 1) {
        cur++
        if (cur > best) {
          best = cur
          bestStart = curStart
        }
      } else {
        cur = 1
        curStart = sorted[i]
      }
    }
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const startStr = `${bestStart.getDate()} ${months[bestStart.getMonth()]} ${bestStart.getFullYear()}`
    return { days: best, startDate: startStr }
  }

  let longestStreakName = members[0] || "Unknown"
  let longestStreakDays = 0
  let longestStreakStart = ""
  for (const name of members) {
    const result = longestConsecutiveDays(senderDays[name] || new Set())
    if (result.days > longestStreakDays) {
      longestStreakDays = result.days
      longestStreakName = name
      longestStreakStart = result.startDate
    }
  }

  // Longest message — find the single message with the most characters (skip media/system)
  // Strip any embedded timestamps from continuation lines that leaked into the message text.
  // WhatsApp continuation lines sometimes include "[DD/MM/YY, HH:MM:SS] Name:" patterns.
  const TIMESTAMP_LEAK_REGEX = /\[?\d{1,2}\/\d{1,2}\/\d{2,4},?\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?\]?\s*[^:]*:\s*/gi

  let longestMsgSender = members[0] || "Unknown"
  let longestMsgLength = 0
  let longestMsgPreview = ""
  let longestMsgDate = ""
  for (const m of messages) {
    // Clean the message: remove embedded timestamps/sender prefixes that leaked from continuation lines
    const cleaned = m.message.replace(TIMESTAMP_LEAK_REGEX, " ").replace(/\s{2,}/g, " ").trim()
    // Also skip messages that are essentially empty after cleaning, or are just omitted media
    if (cleaned.length < 2) continue
    if (OMITTED_REGEX.test(cleaned)) continue

    if (cleaned.length > longestMsgLength) {
      longestMsgLength = cleaned.length
      longestMsgSender = m.sender
      // Truncate preview to 120 chars
      longestMsgPreview = cleaned.length > 120 ? cleaned.slice(0, 120) + "…" : cleaned
      const d = m.timestamp
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      longestMsgDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    }
  }

  return {
    groupName,
    totalMessages,
    members,
    topTexter: { name: topTexterName, count: topTexterCount, percent: topTexterPercent },
    topWord: { word: topWordStr, count: topWordCount },
    messagesByHour,
    peakHour,
    nightMessages,
    leftOnRead: { name: leftOnReadName, count: leftOnReadCount },
    mostDramatic: { name: mostDramaticName, count: mostDramaticCount },
    emojiKing: { name: emojiKingName, topEmoji: kingTopEmoji, count: emojiKingCount },
    slowTexter: { name: slowTexterName, avgMinutes: Math.round(slowTexterAvg) },
    lurker: { name: lurkerName, count: lurkerCount, percent: lurkerPercent },
    convoStarter: { name: convoStarterName, count: convoStarterCount },
    morningVsNight: {
      morningPerson: { name: morningPersonName, morningCount: morningPersonMorning, total: senderCounts[morningPersonName] || 0 },
      nightOwlPerson: { name: nightOwlPersonName, nightCount: nightOwlPersonNight, total: senderCounts[nightOwlPersonName] || 0 },
      groupMorningPct,
      groupNightPct,
    },
    longestStreak: { name: longestStreakName, days: longestStreakDays, startDate: longestStreakStart },
    longestMessage: { name: longestMsgSender, length: longestMsgLength, preview: longestMsgPreview, date: longestMsgDate },
  }
}
