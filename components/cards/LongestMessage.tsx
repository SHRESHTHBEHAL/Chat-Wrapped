"use client"

import { useEffect, useState } from "react"
import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function LongestMessage({ stats, roasts, flash }: Props) {
  const { name, length, preview, date } = stats.longestMessage
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const ACCENT = "#FF6B00"
  // word count estimate
  const wordCount = preview ? preview.split(/\s+/).filter(Boolean).length : 0

  return (
    <CardShell accentColor={ACCENT} flash={flash}>
      {/* Full dark background */}
      <div style={{ position: "absolute", inset: 0, background: "#0a0a0a", zIndex: 0 }} />

      {/* Repeating ESSAY watermark */}
      <div className="font-brutal" style={{
        position: "absolute",
        inset: "-40px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        color: "transparent",
        WebkitTextStroke: `1px rgba(255, 107, 0, 0.06)`,
        fontSize: "52px",
        lineHeight: 1.1,
        pointerEvents: "none",
        transform: "rotate(-8deg)",
        zIndex: 1,
        userSelect: "none",
      }}>
        {Array(40).fill("ESSAY").join(" ")}
      </div>

      <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 10 }}>

        {/* Title */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{
            background: ACCENT,
            color: "#000",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "11px",
            letterSpacing: "0.15em",
            padding: "5px 12px",
            border: "2px solid #000",
            boxShadow: `4px 4px 0px #000`,
            display: "inline-block",
            transform: "rotate(-1deg)",
            marginBottom: "16px",
          }}>
            LONGEST MESSAGE EVER SENT
          </div>
          <div className="font-brutal" style={{
            fontSize: name.length > 10 ? "clamp(32px, 9vw, 52px)" : "clamp(44px, 13vw, 68px)",
            color: "#ffffff",
            lineHeight: 0.9,
            wordBreak: "break-word",
            textShadow: `4px 4px 0px ${ACCENT}`,
          }}>
            {name.toUpperCase()}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div style={{
            background: "#000",
            border: `3px solid ${ACCENT}`,
            boxShadow: `4px 4px 0px ${ACCENT}`,
            padding: "10px 14px",
            flex: 1,
            transform: "rotate(-1deg)",
          }}>
            <div className="font-brutal" style={{ fontSize: "32px", color: ACCENT, lineHeight: 1 }}>
              {length.toLocaleString()}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", color: "#666", letterSpacing: "0.1em" }}>
              CHARACTERS
            </div>
          </div>
          <div style={{
            background: "#000",
            border: "3px solid #ffffff",
            boxShadow: "4px 4px 0px #333",
            padding: "10px 14px",
            flex: 1,
            transform: "rotate(1deg)",
          }}>
            <div className="font-brutal" style={{ fontSize: "32px", color: "#ffffff", lineHeight: 1 }}>
              ~{wordCount}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", color: "#666", letterSpacing: "0.1em" }}>
              WORDS
            </div>
          </div>
        </div>

        {/* The actual message preview */}
        <div style={{
          background: "#111",
          border: `3px solid ${ACCENT}`,
          boxShadow: `6px 6px 0px ${ACCENT}`,
          padding: "16px",
          marginBottom: "16px",
          position: "relative",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
        }}>
          {/* Quotation mark decoration */}
          <div className="font-brutal" style={{
            position: "absolute",
            top: "-16px",
            left: "12px",
            fontSize: "48px",
            color: ACCENT,
            lineHeight: 1,
          }}>
            &ldquo;
          </div>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "13px",
            fontWeight: "600",
            color: "#dddddd",
            lineHeight: 1.6,
            margin: 0,
            marginTop: "8px",
            wordBreak: "break-word",
          }}>
            {preview}
          </p>
        </div>

        {/* Date stamp */}
        {date && (
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "11px",
            color: "#555",
            letterSpacing: "0.12em",
            marginBottom: "12px",
          }}>
            SENT ON {date.toUpperCase()}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Roast */}
        <div style={{
          background: ACCENT,
          color: "#000",
          padding: "12px 16px",
          border: "3px solid #000",
          boxShadow: "4px 4px 0px #000",
        }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "14px",
            margin: 0,
            lineHeight: 1.4,
          }}>
            &ldquo;{roasts.longestMessageRoast}&rdquo;
          </p>
        </div>

      </div>
    </CardShell>
  )
}
