"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import UploadZone from "@/components/UploadZone"
import { parseChat, extractGroupName } from "@/lib/parser"
import { calculateStats } from "@/lib/stats"
import { ChatStats } from "@/lib/types"

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [chat, setChat] = useState<{ file: File; stats: ChatStats } | null>(null)

  const processFile = useCallback(async (file: File): Promise<ChatStats | null> => {
    const text = await file.text()
    const fileBaseName = file.name.replace(/\.txt$/i, "").replace(/WhatsApp Chat with /i, "").trim()
    const isGeneric = /^(chat|export|whatsapp|backup|messages?)$/i.test(fileBaseName)
    const rawName = isGeneric ? (extractGroupName(text) ?? fileBaseName) : fileBaseName
    const groupName = rawName || "THE GROUP"
    const messages = parseChat(text)
    if (messages.length === 0) {
      alert("Couldn't find any messages in this file.")
      return null
    }
    return calculateStats(messages, groupName)
  }, [])

  const handleFile = useCallback(async (file: File) => {
    const stats = await processFile(file)
    if (stats) setChat({ file, stats })
  }, [processFile])

  const handleLaunch = useCallback(async () => {
    if (!chat) return
    setLoading(true)
    sessionStorage.setItem("chatStats", JSON.stringify(chat.stats))
    sessionStorage.removeItem("chatStats2")
    router.push("/wrapped")
  }, [chat, router])

  return (
    <main className="bg-grid" style={{
      minHeight: "100vh",
      background: "#050505",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {loading ? (
        <div style={{
          background: "#FF0055",
          padding: "40px",
          border: "4px solid #ffffff",
          boxShadow: "10px 10px 0px #000000",
          textAlign: "center"
        }}>
          <div className="font-brutal" style={{
            color: "#ffffff",
            fontSize: "clamp(32px, 8vw, 60px)",
            letterSpacing: "0.05em",
            marginBottom: "24px",
            textShadow: "4px 4px 0px #000"
          }}>
            WRAPPING IT UP...
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: "20px",
                height: "20px",
                background: "#000",
                animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: "520px", zIndex: 10 }}>
          {/* Logo */}
          <div style={{ marginBottom: "40px", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", inset: "-40px -20px", background: "#FF0055", zIndex: -1, border: "4px solid #fff", boxShadow: "10px 10px 0px #000", transform: "rotate(-2deg)" }} />
            <h1 className="font-brutal" style={{
              fontSize: "clamp(50px, 16vw, 100px)",
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 0.85,
              margin: 0,
              textShadow: "4px 4px 0px #000"
            }}>
              CHAT<br />
              <span style={{ color: "#000", WebkitTextStroke: "2px #fff", textShadow: "none" }}>WRAPPED</span>
            </h1>
            <p style={{
              color: "#000",
              fontWeight: "700",
              fontSize: "16px",
              marginTop: "16px",
              background: "#fff",
              display: "inline-block",
              padding: "4px 12px",
              border: "2px solid #000",
              transform: "rotate(2deg)"
            }}>
              FIND OUT WHO YOUR GROUP CHAT REALLY IS.
            </p>
          </div>

          {/* Upload */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div className="font-brutal" style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.15em" }}>
                YOUR CHAT
              </div>
              {chat && (
                <div style={{ background: "#00FF85", color: "#000", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", fontSize: "11px", padding: "3px 10px", border: "2px solid #000" }}>
                  ✓ {chat.stats.groupName.toUpperCase()}
                </div>
              )}
            </div>
            <div style={{
              background: "#fff",
              border: "4px solid #000",
              boxShadow: chat ? "10px 10px 0px #00FF85" : "10px 10px 0px #FF0055",
              transform: "rotate(1deg)",
              padding: "8px",
              transition: "box-shadow 0.3s"
            }}>
              <UploadZone onFile={handleFile} loading={false} />
            </div>
          </div>

          {/* Launch Button */}
          {chat && (
            <button
              onClick={handleLaunch}
              className="brutal-button"
              style={{ width: "100%", fontSize: "24px", padding: "20px", marginBottom: "32px" }}
            >
              LET&apos;S GO →
            </button>
          )}

          {/* Export instructions */}
          <div style={{
            background: "#111",
            border: "2px solid #333",
            padding: "16px",
            textAlign: "center"
          }}>
            <h3 style={{
              color: "#fff",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>HOW TO EXPORT YOUR CHAT</h3>
            <p style={{
              color: "#aaaaaa",
              fontSize: "14px",
              lineHeight: 1.5,
              fontWeight: "600",
            }}>
              Open WhatsApp → Go to Chat Info<br />
              <span style={{ color: "#FF0055" }}>Export Chat</span> → Select <span style={{ color: "#FF0055" }}>Without Media</span>
            </p>
          </div>

          <div style={{ marginTop: "48px", textAlign: "center" }}>
            <p className="font-brutal" style={{
              color: "#333",
              fontSize: "16px",
              letterSpacing: "0.1em"
            }}>
              MADE WITH LOVE BY SHRESHTH BEHAL
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </main>
  )
}
