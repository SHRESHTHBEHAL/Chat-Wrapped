"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function ConvoStarter({ stats, roasts, flash }: Props) {
  const name = stats.convoStarter?.name || "Unknown"
  const count = stats.convoStarter?.count ?? 0
  const displayName = name.toUpperCase()

  return (
    <CardShell accentColor="#00CFFF" flash={flash}>
      <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}>

        {/* Background speech bubble watermarks */}
        <div style={{
          position: "absolute",
          top: "5%",
          right: "-30px",
          fontSize: "180px",
          opacity: 0.07,
          zIndex: 0,
          pointerEvents: "none"
        }}>💬</div>
        <div style={{
          position: "absolute",
          bottom: "20%",
          left: "-30px",
          fontSize: "130px",
          opacity: 0.06,
          zIndex: 0,
          pointerEvents: "none"
        }}>💬</div>

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Label */}
          <div style={{
            background: "#00CFFF",
            color: "#000000",
            padding: "6px 16px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "12px",
            letterSpacing: "0.15em",
            border: "2px solid #000",
            boxShadow: "4px 4px 0px #ffffff",
            alignSelf: "flex-start",
            marginBottom: "32px",
            transform: "rotate(1deg)"
          }}>
            CONVO STARTER
          </div>

          {/* Name */}
          <div className="font-brutal" style={{
            color: "#ffffff",
            fontSize: displayName.length > 10 ? "clamp(40px, 12vw, 64px)" : "clamp(56px, 18vw, 90px)",
            lineHeight: 0.9,
            overflowWrap: "anywhere",
            textShadow: "5px 5px 0px #00CFFF",
            marginBottom: "32px"
          }}>
            {displayName}
          </div>

          {/* Count block */}
          <div style={{
            background: "#00CFFF",
            padding: "24px",
            border: "4px solid #000",
            boxShadow: "8px 8px 0px #ffffff",
            transform: "rotate(-2deg)",
            marginBottom: "32px",
            alignSelf: "flex-start"
          }}>
            <div className="font-brutal" style={{ color: "#000000", fontSize: "clamp(64px, 20vw, 96px)", lineHeight: 0.85 }}>
              {count}
            </div>
            <div style={{ color: "#000000", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "13px", letterSpacing: "0.1em", marginTop: "8px" }}>
              CONVOS STARTED
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Roast */}
          <div style={{
            background: "#000000",
            border: "3px solid #00CFFF",
            boxShadow: "5px 5px 0px #00CFFF",
            padding: "16px",
          }}>
            <p style={{
              color: "#ffffff",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "15px",
              fontWeight: "700",
              margin: 0,
              lineHeight: 1.4
            }}>
              &ldquo;{roasts.convoStarterRoast}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
