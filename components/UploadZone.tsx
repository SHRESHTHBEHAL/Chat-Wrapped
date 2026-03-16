"use client"

import { useRef, useState } from "react"

interface UploadZoneProps {
  onFile: (file: File) => void
  loading: boolean
}

export default function UploadZone({ onFile, loading }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.name.endsWith(".txt")) {
      alert("Please upload a WhatsApp .txt export file")
      return
    }
    onFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onClick={() => !loading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `4px dashed ${dragging ? "#FF0055" : "#000000"}`,
        padding: "48px 32px",
        textAlign: "center",
        cursor: loading ? "wait" : "pointer",
        transition: "border-color 0.2s, background 0.2s",
        background: dragging ? "#ffe5ee" : "transparent",
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto"
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />

      <div style={{ fontSize: "64px", marginBottom: "16px", textShadow: "4px 4px 0px rgba(0,0,0,0.2)" }}>📱</div>

      <h2 className="font-brutal" style={{
        color: "#000000",
        fontSize: "clamp(24px, 6vw, 32px)",
        lineHeight: 1,
        marginBottom: "8px",
        textTransform: "uppercase"
      }}>
        DROP YOUR EXPORT
      </h2>
      <p style={{
        color: "#555555",
        fontSize: "14px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: "600",
        marginBottom: "24px",
      }}>
        TXT FILES ONLY / NO DATA STORED
      </p>

      <div className="brutal-button" style={{ display: "inline-block", fontSize: "16px" }}>
        CHOOSE FILE
      </div>

    </div>
  )
}
