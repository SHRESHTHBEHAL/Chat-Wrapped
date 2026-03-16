"use client"

import { useEffect, useRef, useState } from "react"
import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

const SG: React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif" }

function formatHour(h: number) {
  if (h === 0) return "12AM"
  if (h < 12) return `${h}AM`
  if (h === 12) return "12PM"
  return `${h - 12}PM`
}

function Row({
  label,
  value,
  accent,
  delay,
  visible,
}: {
  label: string
  value: string
  accent?: string
  delay: number
  visible: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        padding: "5px 0",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-16px)",
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
    >
      <span style={{ ...SG, fontWeight: 700, fontSize: "8px", letterSpacing: "0.12em", color: "#888888", textTransform: "uppercase" }}>
        {label}
      </span>
      <span
        className="font-brutal"
        style={{ fontSize: "13px", color: accent || "#ffffff", maxWidth: "55%", textAlign: "right", lineHeight: 1.1 }}
      >
        {value}
      </span>
    </div>
  )
}

export default function FinaleCard({ stats, roasts, flash }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const groupName = stats.groupName || "THE GROUP"

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // ---- build rows from all available stats ----
  const rows = [
    { label: "Total messages",    value: (stats.totalMessages ?? 0).toLocaleString() },
    { label: "Top texter",        value: (stats.topTexter?.name || "---").toUpperCase(), accent: "#00FF85" },
    { label: "Top texter share",  value: `${stats.topTexter?.percent ?? 0}% of msgs` },
    { label: "Most used word",    value: `"${stats.topWord?.word || "---"}"` },
    { label: "Word appearances",  value: `${(stats.topWord?.count ?? 0).toLocaleString()}×` },
    { label: "Peak hour",         value: formatHour(stats.peakHour ?? 0), accent: "#FFFF00" },
    { label: "Night messages",    value: (stats.nightMessages ?? 0).toLocaleString() },
    { label: "Emoji king",        value: `${(stats.emojiKing?.name || "---").toUpperCase()} ${stats.emojiKing?.topEmoji || ""}`, accent: "#FF6B6B" },
    { label: "Left on read",      value: (stats.leftOnRead?.name || "---").toUpperCase() },
    { label: "Most dramatic",     value: (stats.mostDramatic?.name || "---").toUpperCase() },
    { label: "Slow texter",       value: `${(stats.slowTexter?.name || "---").toUpperCase()} (${Math.round(stats.slowTexter?.avgMinutes ?? 0)}m avg)` },
    { label: "Convo starter",     value: (stats.convoStarter?.name || "---").toUpperCase(), accent: "#00FF85" },
    { label: "Lurker award",      value: `${(stats.lurker?.name || "---").toUpperCase()} (${stats.lurker?.percent ?? 0}%)` },
    { label: "Longest streak",    value: `${(stats.longestStreak?.name || "---").toUpperCase()} — ${stats.longestStreak?.days ?? 0} days`, accent: "#00FFFF" },
    { label: "Longest essay",     value: `${(stats.longestMessage?.name || "---").toUpperCase()} (${(stats.longestMessage?.length ?? 0).toLocaleString()} chars)` },
    { label: "Morning person",    value: (stats.morningVsNight?.morningPerson?.name || "---").toUpperCase() },
    { label: "Night gremlin",     value: (stats.morningVsNight?.nightOwlPerson?.name || "---").toUpperCase(), accent: "#9B59F5" },
    { label: "Best duo",          value: roasts.compatPair || "---", accent: "#FF6B6B" },
    { label: "Duo compatibility", value: `${roasts.compatScore ?? "?"}/10` },
  ]

  async function handleDownload() {
    try {
      const { default: html2canvas } = await import("html2canvas")
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#050505", useCORS: true })
      const link = document.createElement("a")
      link.download = `chatwrapped-${groupName.toLowerCase().replace(/\s/g, "-")}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (e) {
      console.error("Download failed:", e)
    }
  }

  return (
    <CardShell accentColor="#00FF85" flash={flash}>
      <div
        ref={cardRef}
        style={{ padding: "20px 16px 16px", display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}
      >
        {/* Background watermark */}
        <div className="font-brutal" style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.04)",
          fontSize: "56px",
          lineHeight: 1.1,
          pointerEvents: "none",
          transform: "rotate(-8deg)",
          zIndex: 0,
          overflow: "hidden",
        }}>
          {Array(80).fill("CHAT").join(" ")}
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>

          {/* Header */}
          <div style={{ marginBottom: "10px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
              <div>
                <div className="font-brutal" style={{ fontSize: "clamp(24px, 7vw, 36px)", lineHeight: 0.9, color: "#ffffff", textShadow: "3px 3px 0px #00FF85" }}>
                  {groupName.toUpperCase()}
                </div>
                <div className="font-brutal" style={{ fontSize: "clamp(28px, 8vw, 40px)", lineHeight: 0.9, color: "transparent", WebkitTextStroke: "2px #00FF85" }}>
                  WRAPPED
                </div>
              </div>
              {/* Vibe badge */}
              {roasts.vibeCheckLabel && (
                <div
                  style={{
                    background: "#00FF85",
                    border: "3px solid #000",
                    padding: "4px 8px",
                    transform: "rotate(3deg)",
                    flexShrink: 0,
                    boxShadow: "3px 3px 0 #fff",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.5s ease 200ms",
                  }}
                >
                  <div style={{ ...SG, fontWeight: 700, fontSize: "7px", color: "#000", letterSpacing: "0.1em" }}>VIBE</div>
                  <div className="font-brutal" style={{ fontSize: "12px", color: "#000000", lineHeight: 1 }}>
                    {roasts.vibeCheckLabel}
                  </div>
                </div>
              )}
            </div>

            {/* Receipt label */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
              <div style={{ background: "#fff", color: "#000", ...SG, fontWeight: 700, fontSize: "9px", padding: "2px 8px", border: "2px solid #000" }}>
                FULL RECEIPT
              </div>
              <div style={{ flex: 1, height: "2px", background: "rgba(255,255,255,0.15)" }} />
            </div>
          </div>

          {/* Stats receipt list */}
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginBottom: "10px", paddingRight: "2px" }}>
            {rows.map((row, i) => (
              <Row
                key={row.label}
                label={row.label}
                value={row.value}
                accent={row.accent}
                delay={i * 45}
                visible={visible}
              />
            ))}
          </div>

          {/* Finale roast */}
          <div
            style={{
              background: "#ffffff",
              padding: "8px 12px",
              border: "3px solid #000",
              boxShadow: "4px 4px 0px #00FF85",
              marginBottom: "10px",
              transform: "rotate(-0.5deg)",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease 900ms",
              flexShrink: 0,
            }}
          >
            <div style={{ ...SG, fontWeight: 700, fontSize: "7px", color: "#888", letterSpacing: "0.15em", marginBottom: "2px" }}>
              FINAL VERDICT
            </div>
            <p style={{ color: "#000", ...SG, fontWeight: 700, fontSize: "11px", margin: 0, lineHeight: 1.3 }}>
              &ldquo;{roasts.finaleRoast}&rdquo;
            </p>
          </div>

          {/* Button */}
          <div style={{ display: "flex", flexShrink: 0 }}>
            <button
              onClick={handleDownload}
              className="brutal-button"
              style={{ flex: 1, fontSize: "14px", padding: "10px", background: "#00FF85" }}
            >
              SAVE IMAGE
            </button>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
