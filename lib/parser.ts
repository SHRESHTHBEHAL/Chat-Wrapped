import { ParsedMessage } from "./types"

// WhatsApp .txt parser — handles both major export formats:
// Format A: [12/03/2025, 09:14:22] Jake: lmaooo why
// Format B: 12/03/2025, 09:14:22 - Jake: lmaooo why

const FORMAT_A = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?\s?(?:AM|PM)?)\]\s(.+?):\s(.+)$/i
const FORMAT_B = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?\s?(?:AM|PM)?)\s-\s(.+?):\s(.+)$/i

const SYSTEM_KEYWORDS = [
  "end-to-end encrypted",
  "messages and calls are end-to-end encrypted",
  " added ",
  " removed ",
  " left",
  " joined",
  "changed the group",
  "changed this group",
  "created group",
  "you were added",
  "security code changed",
  "blocked this contact",
  "deleted this message",
  "missed voice call",
  "missed video call",
  "this message was deleted",
]

// Catch all WhatsApp "<X omitted>" variants (media, image, video, audio, sticker, GIF, document, contact, etc.)
// Matches with or without angle brackets, any casing.
const OMITTED_REGEX = /<?(?:media|image|video|audio|sticker|gif|document|contact|file)\s+omitted>?/i

function isSystemMessage(text: string): boolean {
  const lower = text.toLowerCase()
  return SYSTEM_KEYWORDS.some((kw) => lower.includes(kw)) || OMITTED_REGEX.test(text)
}

function parseTimestamp(dateStr: string, timeStr: string): Date {
  const [day, month, year] = dateStr.split("/").map(Number)
  const fullYear = year < 100 ? 2000 + year : year

  const timeCleaned = timeStr.trim()
  const is12h = /am|pm/i.test(timeCleaned)

  if (is12h) {
    // Manually parse 12h time: "9:14:22 AM" or "11:30 PM" etc.
    const isPM = /pm/i.test(timeCleaned)
    const numericPart = timeCleaned.replace(/\s*(am|pm)\s*/i, "")
    const parts = numericPart.split(":").map(Number)
    let hours = parts[0]
    const minutes = parts[1] ?? 0
    const seconds = parts[2] ?? 0
    // Convert 12h → 24h
    if (hours === 12) hours = isPM ? 12 : 0
    else if (isPM) hours += 12
    return new Date(fullYear, month - 1, day, hours, minutes, seconds)
  }

  const parts = timeCleaned.split(":").map(Number)
  return new Date(fullYear, month - 1, day, parts[0], parts[1], parts[2] ?? 0)
}

// Try to extract the group name from WhatsApp system messages inside the file.
// WhatsApp writes lines like:
//   [12/03/2025, 09:14:22] Jake created group "My Squad"
//   12/03/2025, 09:14 - Jake created group "My Squad"
// Returns null if nothing found.
export function extractGroupName(text: string): string | null {
  const match = text.match(/created group[^\n"]*"([^"]+)"/i)
  if (match) return match[1].trim()
  // Some locales use different quotes or no quotes — try without
  const matchPlain = text.match(/created group[^\n]*[-–]\s*(.+)/i)
  if (matchPlain) {
    const candidate = matchPlain[1].trim()
    // sanity check: shouldn't be a timestamp or URL
    if (candidate.length > 0 && candidate.length < 80 && !candidate.includes("/")) {
      return candidate
    }
  }
  return null
}

export function parseChat(text: string): ParsedMessage[] {
  const lines = text.split("\n")
  const messages: ParsedMessage[] = []
  let currentMessage: ParsedMessage | null = null

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    const match = FORMAT_A.exec(line) || FORMAT_B.exec(line)

    if (match) {
      // Save previous message
      if (currentMessage) {
        messages.push(currentMessage)
      }

      const [, dateStr, timeStr, sender, content] = match

      if (isSystemMessage(content) || isSystemMessage(sender)) {
        currentMessage = null
        continue
      }

      currentMessage = {
        sender: sender.trim(),
        timestamp: parseTimestamp(dateStr, timeStr),
        message: content.trim(),
      }
    } else if (currentMessage) {
      // Continuation of a multiline message
      currentMessage.message += " " + line
    }
  }

  // Push last
  if (currentMessage) {
    messages.push(currentMessage)
  }

  return messages
}
