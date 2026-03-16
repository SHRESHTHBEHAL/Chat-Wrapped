"use client"

interface ProgressBarProps {
  total: number
  current: number
}

export default function ProgressBar({ total, current }: ProgressBarProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        gap: "4px",
        padding: "8px 12px 0",
        background: "transparent",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: "8px",
            background: i <= current ? "#ffffff" : "#1a1a1a",
            border: "1px solid #000",
            boxShadow: i <= current ? "2px 2px 0px rgba(0,0,0,0.5)" : "none",
            transition: "background 0.2s ease",
            transform: i <= current ? "translate(-1px, -1px)" : "none",
          }}
        />
      ))}
    </div>
  )
}
