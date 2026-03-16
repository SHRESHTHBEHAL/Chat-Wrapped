"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function TopTexter({ stats, roasts, flash }: Props) {
  const name = stats.topTexter?.name || "Unknown"
  const count = stats.topTexter?.count ?? 0
  const displayName = name.toUpperCase()
  
  // Create staggered vertical text blocks for the background texture
  const bgText = Array(8).fill("TOP TEXTER").join(" ")

  return (
    <CardShell accentColor="#00FF85" flash={flash}>
      
      {/* Intense green background */}
      <div style={{ position: "absolute", inset: 0, background: "#00FF85", zIndex: 0 }} />
      
      {/* Background brutalist repeating text */}
      <div className="font-brutal" style={{
        position: "absolute",
        left: "-20px",
        top: 0,
        bottom: 0,
        width: "140px",
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        transform: "rotate(180deg)",
        fontSize: "160px",
        color: "transparent",
        WebkitTextStroke: "2px rgba(0,0,0,0.1)",
        lineHeight: 0.8,
        whiteSpace: "nowrap",
        overflow: "hidden",
        zIndex: 1,
        pointerEvents: "none"
      }}>
        {bgText}
      </div>

      <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", position: "relative", zIndex: 10 }}>
        
        {/* Label badge */}
        <div style={{
          background: "#000000",
          color: "#00FF85",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: "700",
          fontSize: "12px",
          padding: "6px 16px",
          border: "2px solid #000000",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.3)",
          alignSelf: "flex-end",
          marginBottom: "32px",
          transform: "rotate(2deg)"
        }}>
          #1 YAPPER
        </div>

        {/* Huge Name */}
        <div style={{ position: "relative", marginBottom: "32px" }}>
          
          <div className="font-brutal" style={{
            position: "absolute",
            top: "-8px",
            left: "8px",
            color: "transparent",
            WebkitTextStroke: "2px rgba(0,0,0,0.2)",
            fontSize: displayName.length > 8 ? "clamp(50px, 14vw, 80px)" : "clamp(70px, 20vw, 110px)",
            lineHeight: 0.9,
            wordBreak: "break-word",
            zIndex: 1
          }}>
            {displayName}
          </div>

          <div className="font-brutal" style={{
            color: "#000000",
            fontSize: displayName.length > 8 ? "clamp(50px, 14vw, 80px)" : "clamp(70px, 20vw, 110px)",
            lineHeight: 0.9,
            wordBreak: "break-word",
            position: "relative",
            zIndex: 10,
            textShadow: "4px 4px 0px #ffffff"
          }}>
            {displayName}
          </div>
        </div>

        {/* Stats Block */}
        <div style={{
          background: "#000000",
          padding: "24px",
          border: "4px solid #ffffff",
          boxShadow: "8px 8px 0px rgba(0,0,0,0.5)",
          marginBottom: "24px",
          transform: "rotate(-1deg)" // Slight tilt
        }}>
          <div className="font-brutal" style={{
            color: "#ffffff",
            fontSize: "48px",
            lineHeight: 1,
            marginBottom: "4px"
          }}>
            {count.toLocaleString()}
          </div>
          <div style={{
            color: "#00FF85",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "14px",
            letterSpacing: "0.1em",
          }}>
            MSGS SENT ({stats.topTexter?.percent}% OF CHAT)
          </div>
        </div>

        {/* Roast footer */}
        <div style={{
          background: "#ffffff",
          color: "#000000",
          padding: "16px",
          border: "4px solid #000000",
          alignSelf: "flex-start",
          maxWidth: "280px"
        }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "16px",
            fontWeight: "700",
            margin: 0,
            lineHeight: 1.3
          }}>
            &ldquo;{roasts.topTexterRoast}&rdquo;
          </p>
        </div>
      </div>
    </CardShell>
  )
}
