"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function LeftOnRead({ stats, roasts, flash }: Props) {
  const name = stats.leftOnRead?.name || "Unknown"
  const count = stats.leftOnRead?.count ?? 0

  return (
    <CardShell accentColor="#FF0055" flash={flash}>
      {/* Full hot pink background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "#FF0055",
        zIndex: 0,
      }} />

      {/* Repeating background texture */}
      <div className="font-brutal" style={{
        position: "absolute",
        inset: "-50px -50px",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        color: "transparent",
        WebkitTextStroke: "1px rgba(0,0,0,0.15)",
        fontSize: "30px",
        lineHeight: 1,
        pointerEvents: "none",
        zIndex: 1,
        transform: "rotate(-10deg)"
      }}>
        {Array(100).fill("IGNORED ").join("")}
      </div>

      <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 10 }}>
        
        {/* Top bar with name */}
        <div style={{
          background: "#000000",
          color: "#FF0055",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: "700",
          fontSize: "12px",
          padding: "8px 16px",
          border: "2px solid #000000",
          boxShadow: "4px 4px 0px #ffffff",
          alignSelf: "flex-start",
          marginBottom: "40px",
          textTransform: "uppercase"
        }}>
          {name}
        </div>

        {/* LEFT ON READ Container */}
        <div style={{
          background: "#ffffff",
          border: "4px solid #000000",
          boxShadow: "10px 10px 0px rgba(0,0,0,0.5)",
          padding: "24px",
          transform: "rotate(-2deg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "40px"
        }}>
          <div className="font-brutal" style={{
            color: "#000000",
            fontSize: "clamp(32px, 10vw, 48px)",
            lineHeight: 0.9,
            marginBottom: "8px",
            textAlign: "center"
          }}>
            LEFT ON READ
          </div>

          <div className="font-brutal" style={{
            color: "#FF0055",
            fontSize: "clamp(80px, 24vw, 120px)",
            lineHeight: 0.85,
            textShadow: "4px 4px 0px #000000"
          }}>
            {count.toLocaleString()}
          </div>
          
          <div style={{
            color: "#000000",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "14px",
            letterSpacing: "0.2em",
            marginTop: "8px"
          }}>
            TIMES
          </div>
        </div>

        {/* Message bubbles scattered */}
        <div style={{ flex: 1, position: "relative", marginTop: "20px" }}>
          <div style={{
            position: "absolute",
            left: "-10px",
            top: 0,
            background: "#000000",
            color: "#ffffff",
            padding: "8px 16px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "16px",
            border: "2px solid #ffffff",
            transform: "rotate(4deg)",
            boxShadow: "4px 4px 0px rgba(255,255,255,0.4)"
          }}>
            HELLO?
          </div>
          
          <div style={{
            position: "absolute",
            right: "-10px",
            top: "60px",
            background: "#ffffff",
            color: "#000000",
            padding: "8px 16px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "16px",
            border: "2px solid #000000",
            transform: "rotate(-3deg)",
            boxShadow: "4px 4px 0px rgba(0,0,0,0.4)"
          }}>
            ANYONE THERE?
          </div>
        </div>

        {/* Footer info block */}
        <div style={{
          borderTop: "3px solid #000000",
          paddingTop: "16px",
          marginTop: "32px",
          background: "#FF0055"
        }}>
          <p style={{
            color: "#ffffff",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "15px",
            fontWeight: "600",
            lineHeight: 1.4,
            textShadow: "1px 1px 0px #000000"
          }}>
              &ldquo;{roasts.leftOnReadRoast}&rdquo;
          </p>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
            color: "#000000",
            fontFamily: "Anton",
            fontSize: "12px",
            letterSpacing: "0.1em"
          }}>
            <span>CHAT WRAPPED</span>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
