import { ParsedMessage, ChatStats } from "./types"

const STOPWORDS = new Set([
  "the","a","is","to","and","i","you","it","in","of","that","was","for","on",
  "are","at","be","this","with","but","not","have","had","they","he","she","we",
  "so","if","my","your","just","me","do","its","no","up","get","can","been",
  "has","or","an","his","her","out","im","dont","ok","yeah","yes","like","got",
  "will","from","about","what","know","think","going","want","one","more","also",
  "would","could","should","time","day","then","than","there","so","all","as",
  "by","oh","lol","haha","hahaha","okay","na","la","yah","nah","ah","eh","lah",
])

export function calculateStats(messages: ParsedMessage[], groupName: string): ChatStats {
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

  // Left on read — count how many times each person sent the final message in a streak  
  // A streak = consecutive messages by same person uninterrupted by others
  const leftOnReadCounts: Record<string, number> = {}
  let i = 0
  while (i < messages.length) {
    const sender = messages[i].sender
    let j = i + 1
    // Find run of same sender
    while (j < messages.length && messages[j].sender === sender) j++
    // This person sent multiple in a row (or is just one) — check if someone replied
    const nextSender = j < messages.length ? messages[j].sender : null
    if (nextSender && nextSender !== sender) {
      // They did reply eventually — not left on read … skip
    } else if (nextSender === null) {
      // Last in chat — potential left on read
      if (j - i >= 2) {
        leftOnReadCounts[sender] = (leftOnReadCounts[sender] || 0) + 1
      }
    }
    i = j
  }
  // Re-approach: count streaks where same sender sent 2+ uninterrupted
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
  }
}
