"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function SlowTexter({ stats, roasts, flash }: Props) {
  const name = stats.slowTexter?.name || "Unknown"
  const avgMins = stats.slowTexter?.avgMinutes ?? 0
  const displayName = name.toUpperCase()
  const displayTime = avgMins >= 60
    ? `${Math.round(avgMins / 60)}H ${avgMins % 60}M`
    : `${avgMins}M`

  return (
    <CardShell accentColor="#FF5C00" flash={flash}>
      <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>

        {/* Ticker-tape decoration */}
        <div className="font-brutal" style={{
          position: "absolute",
          top: "50%",
          left: "-20px",
          right: "-20px",
          transform: "translateY(-50%) rotate(-6deg)",
          background: "#FF5C00",
          padding: "12px 0",
          color: "#000",
          fontSize: "20px",
          letterSpacing: "0.2em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          zIndex: 0,
          opacity: 0.12,
        }}>
          {Array(20).fill("SLOW TEXTER ").join("")}
        </div>

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Label */}
          <div className="font-brutal" style={{
            color: "#FF5C00",
            fontSize: "14px",
            letterSpacing: "0.2em",
            marginBottom: "16px",
            border: "2px solid #FF5C00",
            padding: "4px 12px",
            alignSelf: "flex-start",
            transform: "rotate(-1deg)"
          }}>
            SLOWEST TO REPLY
          </div>

          {/* Name */}
          <div className="font-brutal" style={{
            color: "#ffffff",
            fontSize: displayName.length > 10 ? "clamp(40px, 12vw, 64px)" : "clamp(56px, 18vw, 90px)",
            lineHeight: 0.9,
            overflowWrap: "anywhere",
            marginBottom: "40px",
            textShadow: "5px 5px 0px #FF5C00"
          }}>
            {displayName}
          </div>

          {/* Time display */}
          <div style={{
            background: "#111111",
            border: "4px solid #ffffff",
            boxShadow: "8px 8px 0px #FF5C00",
            padding: "28px 24px",
            transform: "rotate(-2deg)",
            marginBottom: "32px"
          }}>
            <div style={{ color: "#FF5C00", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "11px", letterSpacing: "0.15em", marginBottom: "8px" }}>
              AVG REPLY TIME
            </div>
            <div className="font-brutal" style={{
              color: "#ffffff",
              fontSize: "clamp(60px, 20vw, 96px)",
              lineHeight: 0.85,
              textShadow: "4px 4px 0px #FF5C00"
            }}>
              {displayTime}
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Roast */}
          <div style={{
            borderLeft: "6px solid #FF5C00",
            paddingLeft: "16px",
          }}>
            <p style={{
              color: "#ffffff",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "15px",
              fontWeight: "700",
              margin: 0,
              lineHeight: 1.4
            }}>
              &ldquo;{roasts.slowTexterRoast}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
