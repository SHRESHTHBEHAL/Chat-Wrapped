"use client"

import CardShell from "../CardShell"
import { ChatStats, Roasts } from "@/lib/types"

interface Props {
  stats: ChatStats
  roasts: Roasts
  flash: boolean
}

export default function MorningVsNight({ stats, roasts, flash }: Props) {
  const { morningPerson, nightOwlPerson, groupMorningPct, groupNightPct } = stats.morningVsNight

  const MORNING_COLOR = "#FFD600"
  const NIGHT_COLOR = "#7B2FFF"

  return (
    <CardShell accentColor={MORNING_COLOR} flash={flash}>
      {/* Split background — top half yellow, bottom half purple */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: MORNING_COLOR }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: NIGHT_COLOR }} />
      </div>

      {/* Diagonal divider */}
      <div style={{
        position: "absolute",
        top: "46%",
        left: "-10%",
        width: "120%",
        height: "8%",
        background: "#000000",
        transform: "rotate(-3deg)",
        zIndex: 1,
      }} />

      <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 10 }}>

        {/* Title */}
        <div style={{ marginBottom: "auto" }}>
          <div className="font-brutal" style={{
            fontSize: "clamp(13px, 3.5vw, 18px)",
            color: "#000000",
            letterSpacing: "0.15em",
            marginBottom: "8px",
          }}>
            THE GREAT SPLIT
          </div>
          <h2 className="font-brutal" style={{
            fontSize: "clamp(44px, 13vw, 68px)",
            color: "#000000",
            lineHeight: 0.85,
            textShadow: "4px 4px 0px rgba(0,0,0,0.2)",
          }}>
            MORNING<br />
            <span style={{ color: NIGHT_COLOR, WebkitTextStroke: "2px #000" }}>VS</span><br />
            NIGHT
          </h2>
        </div>

        {/* Group bar */}
        <div style={{ margin: "24px 0 20px" }}>
          <div style={{ display: "flex", height: "20px", border: "3px solid #000", overflow: "hidden", boxShadow: "4px 4px 0px #000" }}>
            <div style={{ width: `${groupMorningPct}%`, background: MORNING_COLOR, borderRight: "3px solid #000" }} />
            <div style={{ flex: 1, background: NIGHT_COLOR }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "11px", color: "#000", letterSpacing: "0.1em" }}>
              ☀ {groupMorningPct}% MORNING
            </span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "11px", color: "#fff", letterSpacing: "0.1em" }}>
              🌙 {groupNightPct}% NIGHT
            </span>
          </div>
        </div>

        {/* Two person cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

          {/* Morning person */}
          <div style={{
            background: "#000000",
            border: "3px solid " + MORNING_COLOR,
            boxShadow: "5px 5px 0px " + MORNING_COLOR,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transform: "rotate(-1deg)",
          }}>
            <div className="font-brutal" style={{ fontSize: "28px", color: MORNING_COLOR, lineHeight: 1 }}>☀</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", color: "#888", letterSpacing: "0.15em", marginBottom: "2px" }}>
                EARLY BIRD
              </div>
              <div className="font-brutal" style={{
                fontSize: morningPerson.name.length > 10 ? "18px" : "24px",
                color: "#ffffff",
                lineHeight: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {morningPerson.name.toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div className="font-brutal" style={{ fontSize: "22px", color: MORNING_COLOR }}>{morningPerson.morningCount.toLocaleString()}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "9px", color: "#666", fontWeight: "700", letterSpacing: "0.1em" }}>MORNING MSGS</div>
            </div>
          </div>

          {/* Night owl */}
          <div style={{
            background: "#000000",
            border: "3px solid " + NIGHT_COLOR,
            boxShadow: "5px 5px 0px " + NIGHT_COLOR,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transform: "rotate(1deg)",
          }}>
            <div className="font-brutal" style={{ fontSize: "28px", color: NIGHT_COLOR, lineHeight: 1 }}>🌙</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "10px", color: "#888", letterSpacing: "0.15em", marginBottom: "2px" }}>
                NIGHT GREMLIN
              </div>
              <div className="font-brutal" style={{
                fontSize: nightOwlPerson.name.length > 10 ? "18px" : "24px",
                color: "#ffffff",
                lineHeight: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {nightOwlPerson.name.toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div className="font-brutal" style={{ fontSize: "22px", color: NIGHT_COLOR }}>{nightOwlPerson.nightCount.toLocaleString()}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "9px", color: "#666", fontWeight: "700", letterSpacing: "0.1em" }}>NIGHT MSGS</div>
            </div>
          </div>
        </div>

        {/* Roast */}
        <div style={{
          marginTop: "16px",
          background: "#ffffff",
          color: "#000000",
          padding: "12px 16px",
          border: "3px solid #000",
          boxShadow: "4px 4px 0px #000",
        }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "14px", margin: 0, lineHeight: 1.4 }}>
            &ldquo;{roasts.morningVsNightRoast}&rdquo;
          </p>
        </div>

      </div>
    </CardShell>
  )
}
