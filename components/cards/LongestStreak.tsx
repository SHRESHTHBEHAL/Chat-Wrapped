"use client"

import { useEffect, useState } from "react"
import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function LongestStreak({ stats, roasts, flash }: Props) {
  const { name, days, startDate } = stats.longestStreak
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Build a visual "calendar strip" — 7 filled blocks representing the streak (capped display)
  const displayDays = Math.min(days, 14)
  const ACCENT = "#00E5FF"

  return (
    <CardShell accentColor={ACCENT} flash={flash}>
      {/* Dark grid bg */}
      <div style={{ position: "absolute", inset: 0, background: "#050505", zIndex: 0 }} />

      {/* Giant faded number behind everything */}
      <div className="font-brutal" style={{
        position: "absolute",
        right: "-20px",
        bottom: "60px",
        fontSize: "clamp(160px, 48vw, 260px)",
        color: "transparent",
        WebkitTextStroke: "2px rgba(0, 229, 255, 0.08)",
        lineHeight: 1,
        zIndex: 1,
        pointerEvents: "none",
        userSelect: "none",
      }}>
        {days}
      </div>

      <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 10 }}>

        {/* Badge */}
        <div style={{
          background: ACCENT,
          color: "#000000",
          padding: "6px 14px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: "700",
          fontSize: "11px",
          letterSpacing: "0.15em",
          border: "2px solid #000",
          boxShadow: "4px 4px 0px #000",
          alignSelf: "flex-start",
          marginBottom: "24px",
          transform: "rotate(-1.5deg)",
        }}>
          LONGEST STREAK
        </div>

        {/* Name */}
        <div className="font-brutal" style={{
          fontSize: name.length > 10 ? "clamp(36px, 10vw, 56px)" : "clamp(50px, 15vw, 76px)",
          color: "#ffffff",
          lineHeight: 0.9,
          wordBreak: "break-word",
          marginBottom: "8px",
          textShadow: `4px 4px 0px ${ACCENT}`,
        }}>
          {name.toUpperCase()}
        </div>

        {/* Days count */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "28px" }}>
          <div className="font-brutal" style={{ fontSize: "clamp(56px, 18vw, 96px)", color: ACCENT, lineHeight: 1 }}>
            {days}
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "16px", color: "#ffffff", letterSpacing: "0.05em" }}>
            DAYS<br />STRAIGHT
          </div>
        </div>

        {/* Calendar strip */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", color: "#555", letterSpacing: "0.15em", marginBottom: "8px" }}>
            {startDate ? `STARTING ${startDate.toUpperCase()}` : "CONSECUTIVE DAYS TEXTED"}
          </div>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {Array.from({ length: displayDays }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "28px",
                  height: "28px",
                  background: ACCENT,
                  border: "2px solid #000",
                  boxShadow: "2px 2px 0px #000",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "scale(1)" : "scale(0.5)",
                  transition: `opacity 0.3s ease ${i * 40}ms, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${i * 40}ms`,
                }}
              />
            ))}
            {days > 14 && (
              <div style={{
                width: "28px",
                height: "28px",
                border: `2px solid ${ACCENT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: ACCENT,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: "700",
                fontSize: "10px",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.4s ease 600ms",
              }}>
                +{days - 14}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Roast */}
        <div style={{
          borderLeft: `6px solid ${ACCENT}`,
          paddingLeft: "14px",
        }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "15px",
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.4,
          }}>
            &ldquo;{roasts.longestStreakRoast}&rdquo;
          </p>
        </div>
      </div>
    </CardShell>
  )
}
