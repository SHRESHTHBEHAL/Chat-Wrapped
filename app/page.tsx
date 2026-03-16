"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import UploadZone from "@/components/UploadZone"
import { parseChat } from "@/lib/parser"
import { calculateStats } from "@/lib/stats"

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [statusText, setStatusText] = useState("")

  const handleFile = useCallback(async (file: File) => {
    setLoading(true)
    setStatusText("READING YOUR MESSAGES...")

    try {
      const text = await file.text()

      // Extract group name from filename
      const rawName = file.name.replace(/\.txt$/i, "").replace(/WhatsApp Chat with /i, "").trim()
      const groupName = rawName || "THE GROUP"

      setStatusText("PARSING THE CHAOS...")
      const messages = parseChat(text)

      if (messages.length === 0) {
        alert("Couldn't find any messages. Make sure this is a WhatsApp .txt export.")
        setLoading(false)
        return
      }

      setStatusText("CRUNCHING NUMBERS...")
      const stats = calculateStats(messages, groupName)

      sessionStorage.setItem("chatStats", JSON.stringify(stats))
      router.push("/wrapped")
    } catch (err) {
      console.error(err)
      alert("Something went wrong reading this file. Try again.")
      setLoading(false)
    }
  }, [router])

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
            animation: "blink 1.2s ease-in-out infinite",
            textShadow: "4px 4px 0px #000"
          }}>
            {statusText}
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
        <div style={{ width: "100%", maxWidth: "500px", zIndex: 10 }}>
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
              letterSpacing: "0.02em",
              background: "#fff",
              display: "inline-block",
              padding: "4px 12px",
              border: "2px solid #000",
              transform: "rotate(2deg)"
            }}>
              FIND OUT WHO YOUR GROUP CHAT REALLY IS.
            </p>
          </div>

          <div style={{ 
            background: "#fff", 
            border: "4px solid #000",
            boxShadow: "10px 10px 0px #FF0055",
            transform: "rotate(1deg)",
            padding: "8px"
          }}>
            <UploadZone onFile={handleFile} loading={loading} />
          </div>

          <div style={{
            marginTop: "32px",
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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </main>
  )
}
