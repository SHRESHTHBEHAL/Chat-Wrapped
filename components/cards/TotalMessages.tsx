"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function TotalMessages({ stats, roasts, flash }: Props) {
  const count = stats.totalMessages ?? 0
  const countStr = count.toLocaleString()

  return (
    <CardShell accentColor="#FFE500" flash={flash}>
      <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        
        <div style={{
          display: "inline-block",
          border: "2px solid #FFE500",
          color: "#FFE500",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: "700",
          fontSize: "12px",
          padding: "6px 12px",
          letterSpacing: "0.1em",
          alignSelf: "flex-start",
          background: "rgba(255, 229, 0, 0.1)",
        }}>
          TOTAL MESSAGES
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          
          {/* Layered Number Effect */}
          <div style={{ position: "relative", width: "100%", height: "200px" }}>
            <div className="font-brutal" style={{
              position: "absolute",
              top: 0,
              left: 0,
              color: "transparent",
              WebkitTextStroke: "2px rgba(255, 229, 0, 0.4)",
              fontSize: "clamp(80px, 24vw, 140px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              zIndex: 1,
              transform: "translate(-8px, -12px)",
            }}>
              {countStr}
            </div>
            
            <div className="font-brutal" style={{
              position: "absolute",
              top: 0,
              left: 0,
              color: "transparent",
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.2)",
              fontSize: "clamp(80px, 24vw, 140px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              zIndex: 2,
              transform: "translate(8px, 12px)",
            }}>
              {countStr}
            </div>

            <div className="font-brutal" style={{
              position: "absolute",
              top: 0,
              left: 0,
              color: "#FFE500",
              fontSize: "clamp(80px, 24vw, 140px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              zIndex: 10,
              textShadow: "4px 4px 0px #ffffff",
            }}>
              {countStr}
            </div>
          </div>
          
          {/* Decorative Divider */}
          <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
            <div style={{ height: "8px", width: "40px", background: "#FFE500" }} />
            <div style={{ height: "8px", width: "8px", background: "#ffffff" }} />
            <div style={{ height: "8px", width: "8px", background: "#ffffff" }} />
          </div>

        </div>

        <div style={{ 
          background: "#111111", 
          borderLeft: "6px solid #FFE500", 
          padding: "16px",
          marginTop: "24px"
        }}>
          <p className="font-brutal" style={{
            color: "#ffffff",
            fontSize: "24px",
            lineHeight: 1.1,
            marginBottom: "12px",
            wordBreak: "break-word"
          }}>
            {roasts.totalMessagesRoast}
          </p>
          <p style={{
            color: "#888888",
            fontSize: "12px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "600",
            letterSpacing: "0.1em",
          }}>
            SYSTEM LOG // RECAP
          </p>
        </div>
      </div>
    </CardShell>
  )
}
