"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function NightOwl({ stats, roasts, flash }: Props) {
  const peakHour = stats.peakHour ?? 2
  const nightMessages = stats.nightMessages ?? 0
  const messagesByHour = stats.messagesByHour ?? new Array(24).fill(0)
  const maxCount = Math.max(...messagesByHour, 1)

  const formatHour = (h: number) => {
    if (h === 0) return "12AM"
    if (h < 12) return `${h}AM`
    if (h === 12) return "12PM"
    return `${h - 12}PM`
  }

  const peakStart = formatHour(peakHour)
  const peakEnd = formatHour((peakHour + 2) % 24)

  return (
    <CardShell accentColor="#FF5C00" flash={flash}>
      <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
        
        <div style={{ marginBottom: "32px", position: "relative" }}>
          <h2 className="font-brutal" style={{
            fontSize: "clamp(56px, 18vw, 84px)",
            color: "#ffffff",
            lineHeight: 0.85,
            textShadow: "6px 6px 0px #FF5C00",
          }}>
            THE NIGHT<br />
            <span style={{ color: "#000", WebkitTextStroke: "2px #fff", textShadow: "none" }}>OWL</span>
          </h2>
          <div style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "40px",
            height: "40px",
            background: "#FF5C00",
            borderRadius: "50%",
            zIndex: -1,
            transform: "translate(-10px, -10px)"
          }} />
        </div>

        {/* Highlight pill */}
        <div style={{
          background: "#FF5C00",
          color: "#000000",
          padding: "8px 16px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: "700",
          fontSize: "14px",
          letterSpacing: "0.05em",
          alignSelf: "flex-start",
          border: "2px solid #000000",
          boxShadow: "4px 4px 0px #ffffff",
          marginBottom: "32px",
          transform: "rotate(-2deg)"
        }}>
          PEAK: {peakStart} — {peakEnd}
        </div>

        {/* 24-hr Bar Chart */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          height: "80px",
          marginBottom: "16px",
          borderBottom: "2px solid #333",
          paddingBottom: "8px"
        }}>
          {messagesByHour.map((count, h) => {
            const isNight = h >= 0 && h <= 4
            const isPeak = h === peakHour
            const heightPct = (count / maxCount) * 100
            
            return (
              <div
                key={h}
                title={`${formatHour(h)}: ${count} msgs`}
                style={{
                  flex: 1,
                  height: `${Math.max(heightPct, 4)}%`,
                  background: (isNight || isPeak) ? "#FF5C00" : "#333333",
                  border: (isNight || isPeak) ? "1px solid #ffffff" : "none",
                  transition: "height 0.3s ease",
                }}
              />
            )
          })}
        </div>

        {/* Chart X axis markers */}
        <div style={{ display: "flex", justifyContent: "space-between", color: "#666", fontSize: "10px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", marginBottom: "32px" }}>
          <span>12AM</span>
          <span>6AM</span>
          <span>12PM</span>
          <span>6PM</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Informational Blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="font-brutal" style={{ fontSize: "32px", color: "#ffffff", background: "#FF5C00", padding: "4px 12px", border: "2px solid #fff" }}>
              {nightMessages.toLocaleString()}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: "#aaa", fontWeight: "600", letterSpacing: "0.05em" }}>
              MESSAGES SENT<br/>WHILE THE SUN WAS DOWN.
            </div>
          </div>
          
          <div style={{
            borderLeft: "6px solid #FF5C00",
            paddingLeft: "16px",
            background: "transparent"
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "14px",
              fontWeight: "600",
              color: "#ffffff"
            }}>
              &ldquo;{roasts.nightOwlRoast}&rdquo;
            </p>
          </div>
        </div>
        
      </div>
    </CardShell>
  )
}
