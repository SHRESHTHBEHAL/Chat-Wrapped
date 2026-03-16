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
  "<media omitted>",
  "missed voice call",
  "missed video call",
  "this message was deleted",
]

function isSystemMessage(text: string): boolean {
  const lower = text.toLowerCase()
  return SYSTEM_KEYWORDS.some((kw) => lower.includes(kw))
}

function parseTimestamp(dateStr: string, timeStr: string): Date {
  // Normalise AM/PM just in case
  const [day, month, year] = dateStr.split("/").map(Number)
  const fullYear = year < 100 ? 2000 + year : year

  const timeCleaned = timeStr.trim()
  const is12h = /am|pm/i.test(timeCleaned)

  if (is12h) {
    const combined = `${fullYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${timeCleaned}`
    return new Date(combined)
  }

  const parts = timeCleaned.split(":").map(Number)
  return new Date(fullYear, month - 1, day, parts[0], parts[1], parts[2] ?? 0)
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
