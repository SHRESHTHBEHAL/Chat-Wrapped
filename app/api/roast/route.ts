import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { ChatStats, Roasts } from "@/lib/types"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const FALLBACK_ROASTS: Roasts = {
  introTagline: "you people never stop yapping",
  totalMessagesRoast: "therapy would have been cheaper",
  topTexterRoast: "get some hobbies, seriously",
  topWordRoast: "vocabulary of a golden retriever",
  nightOwlRoast: "sleep is for the unbothered",
  leftOnReadRoast: "chronic ghoster, no remorse",
  dramaticRoast: "shakespearean levels of unhinged",
  finaleRoast: "touch grass. immediately.",
}

export async function POST(req: Request) {
  try {
    const stats: ChatStats = await req.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are writing copy for a brutalist Spotify Wrapped app for a WhatsApp group. Be savage, specific, and very funny. Short punchy lines only — max 8 words each. No emojis. Lowercase except for names.

Stats:
- Group: ${stats.groupName}
- Total messages: ${stats.totalMessages.toLocaleString()}
- Top texter: ${stats.topTexter.name} (${stats.topTexter.percent}% of all messages)
- Most used word: "${stats.topWord.word}" (${stats.topWord.count.toLocaleString()} times)
- Peak hour: ${stats.peakHour}:00
- Left on read: ${stats.leftOnRead.name} (${stats.leftOnRead.count} times)
- Most dramatic: ${stats.mostDramatic.name} (${stats.mostDramatic.count} !? marks)
- Members: ${stats.members.join(", ")}

Return ONLY valid JSON, no markdown, no backticks:
{
  "introTagline": "savage 5 word line about this group",
  "totalMessagesRoast": "roast the message count",
  "topTexterRoast": "roast ${stats.topTexter.name} specifically",
  "topWordRoast": "roast them for saying ${stats.topWord.word} so much",
  "nightOwlRoast": "roast the ${stats.peakHour}:00 activity",
  "leftOnReadRoast": "roast ${stats.leftOnRead.name} for leaving people on read",
  "dramaticRoast": "roast ${stats.mostDramatic.name} for the drama",
  "finaleRoast": "one final roast of the whole group"
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Strip any accidental markdown fences
    const cleaned = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    const roasts: Roasts = JSON.parse(cleaned)

    return NextResponse.json(roasts)
  } catch (err) {
    console.error("Roast API error:", err)
    return NextResponse.json(FALLBACK_ROASTS)
  }
}
