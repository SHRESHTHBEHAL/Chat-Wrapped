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
  emojiKingRoast: "grew up speaking emoji",
  slowTexterRoast: "replies faster than a glacier moves",
  lurkerRoast: "witnesses everything, contributes nothing",
  convoStarterRoast: "desperately filling the silence since forever",
  morningVsNightRoast: "chaotic sleeping schedule, certified",
  longestStreakRoast: "no life outside this group chat",
  longestMessageRoast: "ever heard of a voice note?",
  vibeCheckLabel: "UNHINGED",
  vibeCheckCaption: "no further explanation needed",
  compatPair: "Unknown & Unknown",
  compatScore: 7,
  compatReason: "mutually chaotic, oddly enough it works",
  compatWorstPair: "Unknown & Unknown",
}

export async function POST(req: Request) {
  let stats: ChatStats | null = null
  let fallbackBestPair = "Unknown & Unknown"
  let fallbackWorstPair = "Unknown & Unknown"

  try {
    const body = await req.json()
    // Strip longestMessage.preview so no actual message content hits this server
    if (body?.longestMessage?.preview !== undefined) {
      body.longestMessage = { ...body.longestMessage, preview: "" }
    }
    stats = body as ChatStats
  } catch {
    console.error("Roast API: failed to parse request body")
    return NextResponse.json(FALLBACK_ROASTS)
  }

  // Build sensible fallback pair names from actual members
  const members = stats!.members
  fallbackBestPair = members.length >= 2 ? `${members[0]} & ${members[1]}` : members[0] || "Unknown"
  fallbackWorstPair = members.length >= 3 ? `${members[0]} & ${members[members.length - 1]}` : fallbackBestPair

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" })

    const slowTexterDisplay = stats!.slowTexter.avgMinutes >= 60
      ? `${Math.round(stats!.slowTexter.avgMinutes / 60)}h avg reply`
      : `${stats!.slowTexter.avgMinutes}min avg reply`

    const membersList = stats!.members.join(", ")

    const prompt = `You are writing copy for a brutalist Spotify Wrapped app for a WhatsApp group chat. Be savage, specific, and very funny. Short punchy lines only — max 8-10 words each. No emojis. Lowercase except for names and the vibeCheckLabel.

Stats:
- Group: ${stats!.groupName}
- Members: ${membersList}
- Total messages: ${stats!.totalMessages.toLocaleString()}
- Top texter: ${stats!.topTexter.name} (${stats!.topTexter.percent}% of all messages)
- Most used word: "${stats!.topWord.word}" (${stats!.topWord.count.toLocaleString()} times)
- Peak hour: ${stats!.peakHour}:00
- Left on read: ${stats!.leftOnRead.name} (${stats!.leftOnRead.count} times)
- Most dramatic: ${stats!.mostDramatic.name} (${stats!.mostDramatic.count} !? marks)
- Emoji King: ${stats!.emojiKing.name} (${stats!.emojiKing.count} emojis, fav: ${stats!.emojiKing.topEmoji})
- Slowest texter: ${stats!.slowTexter.name} (${slowTexterDisplay})
- Lurker (least messages): ${stats!.lurker.name} (only ${stats!.lurker.percent}% of chat)
- Convo starter: ${stats!.convoStarter.name} (started ${stats!.convoStarter.count} convos)

IMPORTANT: For compatPair and compatWorstPair, you MUST use the exact names from the Members list above. Pick two real members for each.

Return ONLY valid JSON, no markdown, no backticks:
{
  "introTagline": "savage 5 word line about this group",
  "totalMessagesRoast": "roast the message count",
  "topTexterRoast": "roast ${stats!.topTexter.name} specifically",
  "topWordRoast": "roast them for saying ${stats!.topWord.word} so much",
  "nightOwlRoast": "roast the ${stats!.peakHour}:00 activity",
  "leftOnReadRoast": "roast ${stats!.leftOnRead.name} for leaving people on read",
  "dramaticRoast": "roast ${stats!.mostDramatic.name} for the drama",
  "finaleRoast": "one final roast of the whole group",
  "emojiKingRoast": "roast ${stats!.emojiKing.name} for using ${stats!.emojiKing.count} emojis",
  "slowTexterRoast": "roast ${stats!.slowTexter.name} for taking ${slowTexterDisplay} to reply",
  "lurkerRoast": "roast ${stats!.lurker.name} for only ${stats!.lurker.percent}% of the chat",
  "convoStarterRoast": "roast ${stats!.convoStarter.name} for starting ${stats!.convoStarter.count} convos",
  "morningVsNightRoast": "short line about the group's day/night texting pattern",
  "longestStreakRoast": "roast whoever texted the most consecutive days",
  "longestMessageRoast": "roast whoever wrote the longest essay of a message",
  "vibeCheckLabel": "ONE ALL-CAPS WORD describing group vibe e.g. CHAOTIC, WHOLESOME, TOXIC, UNHINGED, PARASOCIAL, CHAOTIC, MESSY, ICONIC",
  "vibeCheckCaption": "a short savage one-liner explaining this vibe, max 7 words",
  "compatPair": "FullName1 & FullName2 (the two members with most compatible chat styles who would survive a desert island — MUST be real names from the members list)",
  "compatScore": 8,
  "compatReason": "one sentence, why these two would survive together on a desert island, max 10 words, be specific and funny",
  "compatWorstPair": "FullName1 & FullName2 (the pair that would absolutely NOT survive together — MUST be real names from the members list)"
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Strip any accidental markdown fences
    const cleaned = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    const roasts: Roasts = JSON.parse(cleaned)

    // Ensure compat pairs have real names — fall back to actual members if AI returned unknown/empty
    if (!roasts.compatPair || roasts.compatPair.toLowerCase().includes("unknown")) {
      roasts.compatPair = fallbackBestPair
    }
    if (!roasts.compatWorstPair || roasts.compatWorstPair.toLowerCase().includes("unknown")) {
      roasts.compatWorstPair = fallbackWorstPair
    }

    return NextResponse.json(roasts)
  } catch (err) {
    console.error("Roast API error:", err)
    return NextResponse.json({
      ...FALLBACK_ROASTS,
      compatPair: fallbackBestPair,
      compatWorstPair: fallbackWorstPair,
    })
  }
}
