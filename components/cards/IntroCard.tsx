"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function IntroCard({ stats, roasts, flash }: Props) {
  return (
    <CardShell accentColor="#FF0055" flash={flash}>
      <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
        
        {/* Top bar with group name */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "32px", zIndex: 10 }}>
          <div style={{
            background: "#ffffff",
            color: "#000000",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "12px",
            letterSpacing: "0.05em",
            padding: "4px 12px",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #FF0055",
            textTransform: "uppercase",
          }}>
            {(stats.groupName || "THE GROUP")}
          </div>
        </div>

        {/* Huge angled title */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
          <div style={{ transform: "rotate(-4deg)" }}>
            <h1 className="font-brutal" style={{ 
              fontSize: "clamp(60px, 22vw, 90px)", 
              color: "#ffffff", 
              lineHeight: 0.85,
              textShadow: "4px 4px 0px #FF0055",
              margin: 0
            }}>
              CHAT
            </h1>
            <h1 className="font-brutal" style={{ 
              fontSize: "clamp(60px, 22vw, 90px)", 
              color: "#FF0055", 
              lineHeight: 0.85,
              WebkitTextStroke: "2px #ffffff",
              margin: 0,
              marginLeft: "16px"
            }}>
              WRAPPED
            </h1>
          </div>

          {/* Diagonal geometric element */}
          <div style={{
            position: "absolute",
            right: "-20px",
            top: "10%",
            width: "150px",
            height: "4px",
            background: "#FF0055",
            transform: "rotate(-45deg)",
            zIndex: -1
          }} />
          <div style={{
            position: "absolute",
            right: "20px",
            top: "15%",
            width: "100px",
            height: "4px",
            background: "#ffffff",
            transform: "rotate(-45deg)",
            zIndex: -1
          }} />
        </div>

        {/* Footer Area */}
        <div style={{ borderTop: "2px solid #333", paddingTop: "16px", zIndex: 10 }}>
          <div style={{
            background: "#111111",
            border: "1px solid #333",
            padding: "16px",
            marginBottom: "16px",
            transform: "rotate(1deg)",
          }}>
            <p style={{
              color: "#aaaaaa",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "14px",
              fontStyle: "italic",
              lineHeight: 1.4,
              margin: 0,
            }}>
              &ldquo;{roasts.introTagline}&rdquo;
            </p>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <p className="font-brutal" style={{
              color: "#666666",
              fontSize: "12px",
              letterSpacing: "0.15em",
            }}>
              CONFIDENTIAL
            </p>
            <div style={{
              background: "#FF0055",
              width: "24px",
              height: "24px",
              border: "2px solid #ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold"
            }}>
              *
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
