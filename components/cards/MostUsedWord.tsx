"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function MostUsedWord({ stats, roasts, flash }: Props) {
  const word = stats.topWord?.word?.toUpperCase() || "CHAT"
  const count = stats.topWord?.count ?? 0

  return (
    <CardShell accentColor="#2D6BFF" flash={flash}>
      <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        
        {/* Top badge */}
        <div style={{ alignSelf: "flex-start", position: "relative" }}>
          <div style={{
            background: "#ffffff",
            color: "#000",
            padding: "4px 8px",
            fontSize: "10px",
            fontWeight: "bold",
            display: "inline-block",
            transform: "rotate(-2deg)",
            position: "relative",
            zIndex: 10,
            border: "2px solid #000"
          }}>
            TOP SECRET
          </div>
          <div className="font-brutal" style={{
            color: "#2D6BFF",
            fontSize: "20px",
            marginTop: "12px",
            letterSpacing: "0.05em",
            textShadow: "2px 2px 0px #ffffff"
          }}>
            MOST USED WORD
          </div>
        </div>

        {/* Word display */ }
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
          
          {/* Background duplicate words for brutalist texture */}
          <div className="font-brutal" style={{
            position: "absolute",
            top: "10%",
            left: "-10%",
            fontSize: "120px",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.1)",
            lineHeight: 0.8,
            zIndex: 0,
            overflowWrap: "anywhere",
          }}>
            {word}
          </div>
          <div className="font-brutal" style={{
            position: "absolute",
            bottom: "10%",
            right: "-10%",
            fontSize: "120px",
            color: "transparent",
            WebkitTextStroke: "1px rgba(45,107,255,0.2)",
            lineHeight: 0.8,
            zIndex: 0,
            overflowWrap: "anywhere",
          }}>
            {word}
          </div>

          <div className="font-brutal" style={{
            color: "#ffffff",
            fontSize: word.length > 8 ? "clamp(40px, 14vw, 70px)" : word.length > 5 ? "clamp(60px, 20vw, 90px)" : "clamp(80px, 28vw, 140px)",
            lineHeight: 0.9,
            textAlign: "center",
            overflowWrap: "anywhere",
            position: "relative",
            zIndex: 10,
            textShadow: "6px 6px 0px #2D6BFF",
            transform: "rotate(2deg)"
          }}>
            {word}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", zIndex: 10 }}>
          
          {/* Count pill */}
          <div style={{
            display: "inline-block",
            background: "#2D6BFF",
            color: "#ffffff",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "16px",
            padding: "8px 16px",
            border: "2px solid #ffffff",
            boxShadow: "4px 4px 0px rgba(255,255,255,0.3)",
            alignSelf: "flex-start",
            transform: "rotate(-1deg)"
          }}>
            {count.toLocaleString()} TIMES
          </div>
          
          {/* Roast */}
          <div style={{
            background: "#ffffff",
            color: "#000000",
            padding: "16px",
            border: "3px solid #000000",
            boxShadow: "4px 4px 0px #2D6BFF",
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: 1.4,
              margin: 0,
            }}>
              &ldquo;{roasts.topWordRoast}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
