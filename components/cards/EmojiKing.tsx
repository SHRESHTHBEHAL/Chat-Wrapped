"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function EmojiKing({ stats, roasts, flash }: Props) {
  const name = stats.emojiKing?.name || "Unknown"
  const topEmoji = stats.emojiKing?.topEmoji || "😂"
  const count = stats.emojiKing?.count ?? 0
  const displayName = name.toUpperCase()

  return (
    <CardShell accentColor="#FF00FF" flash={flash}>
      <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}>

        {/* Big background emoji */}
        <div style={{
          position: "absolute",
          fontSize: "300px",
          right: "-60px",
          top: "-40px",
          opacity: 0.12,
          lineHeight: 1,
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
          filter: "grayscale(0.3)"
        }}>
          {topEmoji}
        </div>

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "32px"
          }}>
            <div style={{
              background: "#FF00FF",
              color: "#000000",
              padding: "6px 16px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: "700",
              fontSize: "12px",
              letterSpacing: "0.15em",
              border: "2px solid #000000",
              boxShadow: "4px 4px 0px #ffffff",
              transform: "rotate(-1deg)"
            }}>
              EMOJI KING 👑
            </div>
          </div>

          {/* Name */}
          <div className="font-brutal" style={{
            color: "#ffffff",
            fontSize: displayName.length > 10 ? "clamp(40px, 12vw, 64px)" : "clamp(56px, 18vw, 90px)",
            lineHeight: 0.9,
            wordBreak: "keep-all",
            overflowWrap: "anywhere",
            marginBottom: "24px",
            textShadow: "5px 5px 0px #FF00FF"
          }}>
            {displayName}
          </div>

          {/* Emoji + count block */}
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "32px" }}>
            <div style={{
              background: "#ffffff",
              border: "4px solid #000000",
              boxShadow: "6px 6px 0px #FF00FF",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              transform: "rotate(-2deg)"
            }}>
              <span style={{ fontSize: "48px", lineHeight: 1 }}>{topEmoji}</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", color: "#000", letterSpacing: "0.1em" }}>FAVE EMOJI</span>
            </div>

            <div style={{
              background: "#000000",
              border: "4px solid #FF00FF",
              boxShadow: "6px 6px 0px #ffffff",
              padding: "16px 20px",
              transform: "rotate(1deg)"
            }}>
              <div className="font-brutal" style={{ color: "#FF00FF", fontSize: "42px", lineHeight: 1 }}>{count.toLocaleString()}</div>
              <div style={{ color: "#aaaaaa", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", letterSpacing: "0.1em" }}>TOTAL EMOJIS</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Roast */}
          <div style={{
            background: "#FF00FF",
            color: "#000000",
            padding: "16px",
            border: "4px solid #000000",
            boxShadow: "6px 6px 0px #ffffff"
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
              fontWeight: "700",
              margin: 0,
              lineHeight: 1.3
            }}>
              &ldquo;{roasts.emojiKingRoast}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
