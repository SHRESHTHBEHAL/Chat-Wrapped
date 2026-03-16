"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function MostDramatic({ stats, roasts, flash }: Props) {
  const name = stats.mostDramatic?.name || "Unknown"
  const count = stats.mostDramatic?.count ?? 0
  const displayName = name.toUpperCase()

  return (
    <CardShell accentColor="#FFE500" flash={flash}>
      <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
        
        {/* Warning label */}
        <div style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          background: "transparent",
          color: "#FFE500",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: "700",
          fontSize: "12px",
          letterSpacing: "0.2em",
          marginBottom: "24px",
          border: "2px solid #FFE500",
          padding: "6px 12px",
          alignSelf: "flex-start",
          transform: "rotate(-2deg)",
        }}>
          MOST DRAMATIC
        </div>

        {/* Outline repeated name and filled name overlay */}
        <div style={{ position: "relative", marginBottom: "32px", zIndex: 10 }}>
          <div className="font-brutal" style={{
            position: "absolute",
            top: "-15px",
            left: "-5px",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.2)",
            fontSize: displayName.length > 10 ? "clamp(44px, 12vw, 70px)" : "clamp(60px, 18vw, 92px)",
            lineHeight: 0.9,
            wordBreak: "break-word",
          }}>
            {displayName}
          </div>
          <div className="font-brutal" style={{
            position: "absolute",
            top: "15px",
            left: "5px",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)",
            fontSize: displayName.length > 10 ? "clamp(44px, 12vw, 70px)" : "clamp(60px, 18vw, 92px)",
            lineHeight: 0.9,
            wordBreak: "break-word",
          }}>
            {displayName}
          </div>
          <div className="font-brutal" style={{
            color: "#ffffff",
            fontSize: displayName.length > 10 ? "clamp(44px, 12vw, 70px)" : "clamp(60px, 18vw, 92px)",
            lineHeight: 0.9,
            wordBreak: "break-word",
            position: "relative",
            zIndex: 10
          }}>
            {displayName}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          
          {/* Intense Yellow Number Block */}
          <div style={{
            background: "#FFE500",
            display: "inline-block",
            padding: "8px 16px",
            marginBottom: "12px",
            alignSelf: "flex-start",
            border: "4px solid #000000",
            boxShadow: "6px 6px 0px #ffffff",
            transform: "rotate(1deg)",
            position: "relative",
            zIndex: 10
          }}>
            <div className="font-brutal" style={{
              color: "#000000",
              fontSize: "clamp(64px, 20vw, 110px)",
              lineHeight: 0.85,
            }}>
              {count.toLocaleString()}
            </div>
          </div>

          {/* Spliced label text */}
          <div style={{ position: "relative", zIndex: 10 }}>
            <div className="font-brutal" style={{
              color: "#ffffff",
              fontSize: "clamp(24px, 8vw, 40px)",
              letterSpacing: "0.05em",
              transform: "rotate(-3deg)",
              marginBottom: "-10px",
              marginLeft: "10px",
              background: "#000000",
              padding: "0 8px"
            }}>
              EXCLAMATION
            </div>
            <div className="font-brutal" style={{
              color: "#FFE500",
              fontSize: "clamp(24px, 8vw, 40px)",
              letterSpacing: "0.05em",
              transform: "rotate(1deg)",
              background: "#000000",
              padding: "0 8px",
              display: "inline-block"
            }}>
              MARKS USED
            </div>
          </div>

        </div>

        {/* Footer Warning Roast Block */}
        <div style={{
          border: "2px solid #FFE500",
          padding: "16px",
          marginTop: "32px",
          background: "#000000",
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: "-10px", left: "16px", background: "#FFE500", color: "#000", padding: "2px 8px", fontSize: "10px", fontWeight: "bold", fontFamily: "'Space Grotesk', sans-serif" }}>
            CHAT ANALYSIS COMPLETE
          </div>
          <p style={{
            color: "#ffffff",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "15px",
            fontWeight: "700",
            lineHeight: 1.4,
            marginTop: "8px"
          }}>
            &ldquo;{roasts.dramaticRoast}&rdquo;
          </p>
        </div>
      </div>
    </CardShell>
  )
}
