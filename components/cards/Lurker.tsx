"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function Lurker({ stats, roasts, flash }: Props) {
  const name = stats.lurker?.name || "Unknown"
  const count = stats.lurker?.count ?? 0
  const percent = stats.lurker?.percent ?? 0
  const displayName = name.toUpperCase()

  return (
    <CardShell accentColor="#888888" flash={flash}>
      {/* Dark misty background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(160deg, #0a0a0a 0%, #111111 100%)",
        zIndex: 0
      }} />
      
      <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 10 }}>

        {/* Ghost badge */}
        <div style={{
          background: "transparent",
          color: "#888888",
          border: "2px solid #888888",
          padding: "6px 16px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: "700",
          fontSize: "12px",
          letterSpacing: "0.2em",
          alignSelf: "flex-start",
          marginBottom: "40px",
          transform: "rotate(-1deg)"
        }}>
          👻 THE LURKER
        </div>

        {/* Name — fading effect via opacity */}
        <div style={{ position: "relative", marginBottom: "32px" }}>
          <div className="font-brutal" style={{
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.15)",
            fontSize: displayName.length > 10 ? "clamp(40px, 12vw, 60px)" : "clamp(56px, 18vw, 88px)",
            lineHeight: 0.9,
            overflowWrap: "anywhere",
            position: "absolute",
            top: "8px",
            left: "8px",
          }}>
            {displayName}
          </div>
          <div className="font-brutal" style={{
            color: "#ffffff",
            fontSize: displayName.length > 10 ? "clamp(40px, 12vw, 60px)" : "clamp(56px, 18vw, 88px)",
            lineHeight: 0.9,
            overflowWrap: "anywhere",
            position: "relative",
            opacity: 0.7,
          }}>
            {displayName}
          </div>
        </div>

        {/* Minimal stats */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
          <div style={{
            flex: 1,
            background: "#111111",
            border: "2px solid #333333",
            padding: "16px",
          }}>
            <div className="font-brutal" style={{ color: "#888888", fontSize: "42px" }}>{count.toLocaleString()}</div>
            <div style={{ color: "#555", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", letterSpacing: "0.1em" }}>MESSAGES SENT</div>
          </div>

          <div style={{
            flex: 1,
            background: "#888888",
            border: "2px solid #ffffff",
            padding: "16px",
            boxShadow: "4px 4px 0px #ffffff",
            transform: "rotate(1deg)"
          }}>
            <div className="font-brutal" style={{ color: "#000000", fontSize: "42px" }}>{percent}%</div>
            <div style={{ color: "#333", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", letterSpacing: "0.1em" }}>OF THE CHAT</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Roast */}
        <div style={{
          background: "#1a1a1a",
          border: "2px solid #666666",
          padding: "16px",
        }}>
          <p style={{
            color: "#aaaaaa",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "15px",
            fontWeight: "700",
            margin: 0,
            lineHeight: 1.4,
            fontStyle: "italic"
          }}>
            &ldquo;{roasts.lurkerRoast}&rdquo;
          </p>
        </div>
      </div>
    </CardShell>
  )
}
