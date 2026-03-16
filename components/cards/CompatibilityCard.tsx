"use client"

import CardShell from "../CardShell"
import { Roasts } from "@/lib/types"

interface Props {
  roasts: Roasts
  flash: boolean
}

export default function CompatibilityCard({ roasts, flash }: Props) {
  const score = roasts.compatScore ?? 7
  const scorePct = (score / 10) * 100
  const pair = roasts.compatPair || "Unknown & Unknown"
  const worstPair = roasts.compatWorstPair || "Unknown & Unknown"
  const reason = roasts.compatReason || ""

  // Colour based on score
  const scoreColor = score >= 8 ? "#00FF85" : score >= 5 ? "#FFE500" : "#FF0055"

  return (
    <CardShell accentColor={scoreColor} flash={flash}>
      <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}>
        
        {/* Background AI texture */}
        <div className="font-brutal" style={{
          position: "absolute",
          top: "-20px",
          right: "-40px",
          fontSize: "200px",
          color: "transparent",
          WebkitTextStroke: `1px rgba(${score >= 8 ? "0,255,133" : score >= 5 ? "255,229,0" : "255,0,85"},0.08)`,
          lineHeight: 1,
          zIndex: 0,
          userSelect: "none",
          pointerEvents: "none",
        }}>
          AI
        </div>

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header badge */}
          <div style={{
            background: scoreColor,
            color: "#000000",
            padding: "6px 16px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: "11px",
            letterSpacing: "0.2em",
            border: "2px solid #000",
            boxShadow: "4px 4px 0px #ffffff",
            alignSelf: "flex-start",
            marginBottom: "32px",
            transform: "rotate(-1deg)"
          }}>
            🤖 COMPATIBILITY REPORT
          </div>

          {/* Best pair */}
          <div style={{ marginBottom: "8px" }}>
            <div style={{ color: "#888", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", letterSpacing: "0.2em", marginBottom: "8px" }}>
              DESERT ISLAND SURVIVORS
            </div>
            <div className="font-brutal" style={{
              color: "#ffffff",
              fontSize: pair.length > 20 ? "clamp(22px, 7vw, 32px)" : "clamp(28px, 9vw, 42px)",
              lineHeight: 0.95,
              overflowWrap: "anywhere",
              textShadow: `4px 4px 0px ${scoreColor}`
            }}>
              {pair.toUpperCase()}
            </div>
          </div>

          {/* Score bar */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ color: "#888", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", letterSpacing: "0.15em" }}>
                SURVIVAL SCORE
              </div>
              <div className="font-brutal" style={{ color: scoreColor, fontSize: "32px", lineHeight: 1 }}>
                {score}<span style={{ fontSize: "16px", color: "#555" }}>/10</span>
              </div>
            </div>
            <div style={{ background: "#1a1a1a", border: "2px solid #333", height: "20px", position: "relative" }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: `${scorePct}%`,
                background: scoreColor,
                transition: "width 0.5s ease",
                boxShadow: `4px 0px 0px ${scoreColor}66`
              }} />
            </div>
          </div>

          {/* Reason */}
          <div style={{
            background: "#111",
            border: `3px solid ${scoreColor}`,
            boxShadow: `5px 5px 0px ${scoreColor}44`,
            padding: "16px",
            marginBottom: "24px",
          }}>
            <p style={{
              color: "#ffffff",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "15px",
              fontWeight: "700",
              margin: 0,
              lineHeight: 1.4,
            }}>
              &ldquo;{reason}&rdquo;
            </p>
          </div>

          <div style={{ flex: 1 }} />

          {/* Worst pair */}
          <div style={{
            background: "#FF0055",
            border: "3px solid #000",
            boxShadow: "5px 5px 0px rgba(0,0,0,0.5)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}>
            <div style={{ color: "#000", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", letterSpacing: "0.15em", flexShrink: 0 }}>
              ☠️ WOULD NOT SURVIVE
            </div>
            <div className="font-brutal" style={{
              color: "#ffffff",
              fontSize: worstPair.length > 20 ? "14px" : "18px",
              textAlign: "right",
              lineHeight: 1.1,
              overflowWrap: "anywhere"
            }}>
              {worstPair.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
