"use client"

import React from "react"

interface CardShellProps {
  children: React.ReactNode
  accentColor?: string
  flash?: boolean
  id?: string
}

export default function CardShell({ children, accentColor = "#FF0055", flash = false, id }: CardShellProps) {
  return (
    <div
      id={id}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "400px",
        height: "100vh",
        minHeight: "650px",
        maxHeight: "850px",
        margin: "0 auto",
        background: "#050505",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderLeft: "2px solid #1a1a1a",
        borderRight: "2px solid #1a1a1a",
      }}
    >
      {/* Brutalist Top Accent Line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          background: accentColor,
          zIndex: 50,
        }}
      />

      {/* Grid Pattern Behind Content */}
      <div 
        className="bg-grid"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>

      {/* Flash overlay for slide transition */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#ffffff",
          opacity: flash ? 1 : 0,
          transition: "opacity 0.1s ease",
          pointerEvents: "none",
          zIndex: 999,
        }}
      />
    </div>
  )
}
