"use client"

import { useEffect, useRef, useState } from "react"
import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function FinaleCard({ stats, roasts, flash }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const groupName = stats.groupName || "THE GROUP"
  const formatHour = (h: number) => {
    if (h === 0) return "12AM"
    if (h < 12) return `${h}AM`
    if (h === 12) return "12PM"
    return `${h - 12}PM`
  }

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const statPills = [
    { label: "TOP TEXTER", value: (stats.topTexter?.name || "---").toUpperCase() },
    { label: "TOTAL MSGS", value: (stats.totalMessages ?? 0).toLocaleString() },
    { label: "TOP WORD", value: `"${stats.topWord?.word || "---"}"` },
    { label: "PEAK HOUR", value: formatHour(stats.peakHour ?? 0) },
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

  function handleShare() {
    const text = `CHAT WRAPPED 2025 — ${groupName.toUpperCase()}\n\n💬 ${(stats.totalMessages ?? 0).toLocaleString()} total messages\n🏆 Top texter: ${(stats.topTexter?.name || "---").toUpperCase()}\n🔥 Most used word: "${stats.topWord?.word || "---"}"\n\n${roasts.finaleRoast}`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <CardShell accentColor="#00FF85" flash={flash}>
      <div ref={cardRef} style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}>
        
        {/* Background CHAT Grid */}
        <div className="font-brutal" style={{
          position: "absolute",
          inset: "-50px -50px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.05)",
          fontSize: "60px",
          lineHeight: 1.1,
          pointerEvents: "none",
          transform: "rotate(-10deg)",
          zIndex: 0
        }}>
          {Array(100).fill("CHAT").join(" ")}
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <div style={{ borderBottom: "4px solid #ffffff", paddingBottom: "16px", marginBottom: "24px" }}>
            <div className="font-brutal" style={{
              fontSize: "clamp(48px, 14vw, 68px)",
              lineHeight: 0.85,
              color: "#ffffff",
              textShadow: "4px 4px 0px #00FF85"
            }}>
              THE {groupName.toUpperCase()}
            </div>
            <div className="font-brutal" style={{
              fontSize: "clamp(54px, 16vw, 76px)",
              lineHeight: 0.9,
              color: "#transparent",
              WebkitTextStroke: "2px #00FF85",
              marginTop: "4px"
            }}>
              WRAPPED
            </div>
            <div style={{
              background: "#ffffff",
              color: "#000",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: "700",
              fontSize: "12px",
              padding: "4px 12px",
              display: "inline-block",
              marginTop: "16px",
              border: "2px solid #000000"
            }}>
              END OF YEAR RECEIPT
            </div>
          </div>

          {/* Stat Stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {statPills.map((pill, i) => (
              <div
                key={pill.label}
                style={{
                  background: "#000000",
                  border: "2px solid #ffffff",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0) rotate(1deg)" : "translateY(24px) rotate(0deg)",
                  transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${i * 100}ms`,
                  boxShadow: "3px 3px 0px #00FF85"
                }}
              >
                <div style={{ color: "#aaaaaa", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", letterSpacing: "0.15em" }}>
                  {pill.label}
                </div>
                <div className="font-brutal" style={{
                  color: "#ffffff",
                  fontSize: pill.value.length > 10 ? "20px" : "28px",
                  wordBreak: "break-word",
                  maxWidth: "60%",
                  textAlign: "right"
                }}>
                  {pill.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Finale Roast Box */}
          <div style={{
            background: "#ffffff",
            padding: "16px",
            border: "4px solid #000000",
            boxShadow: "6px 6px 0px #00FF85",
            marginBottom: "24px",
            transform: "rotate(-1deg)"
          }}>
            <p style={{
              color: "#000000",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: "700",
              fontSize: "15px",
              margin: 0,
              lineHeight: 1.4
            }}>
              &ldquo;{roasts.finaleRoast}&rdquo;
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", zIndex: 50 }}>
            <button
              onClick={handleDownload}
              className="brutal-button"
              style={{ flex: 1, fontSize: "16px" }}
            >
              SAVE PNG
            </button>
            <button
              onClick={handleShare}
              className="brutal-button"
              style={{ flex: 1, fontSize: "16px", background: "#00FF85" }}
            >
              COPY REC
            </button>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
