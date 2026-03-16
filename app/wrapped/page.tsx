"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChatStats, Roasts } from "@/lib/types"
import ProgressBar from "@/components/ProgressBar"
import IntroCard from "@/components/cards/IntroCard"
import MostUsedWord from "@/components/cards/MostUsedWord"
import TotalMessages from "@/components/cards/TotalMessages"
import TopTexter from "@/components/cards/TopTexter"
import NightOwl from "@/components/cards/NightOwl"
import LeftOnRead from "@/components/cards/LeftOnRead"
import MostDramatic from "@/components/cards/MostDramatic"
import FinaleCard from "@/components/cards/FinaleCard"

const TOTAL_CARDS = 8

const FALLBACK_ROASTS: Roasts = {
  introTagline: "you people never stop yapping",
  totalMessagesRoast: "therapy would have been cheaper",
  topTexterRoast: "get some hobbies, seriously",
  topWordRoast: "vocabulary of a golden retriever",
  nightOwlRoast: "sleep is for the unbothered",
  leftOnReadRoast: "chronic ghoster, no remorse",
  dramaticRoast: "shakespearean levels of unhinged",
  finaleRoast: "touch grass. immediately.",
}

export default function WrappedPage() {
  const router = useRouter()
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [roasts, setRoasts] = useState<Roasts | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentCard, setCurrentCard] = useState(0)
  const [flash, setFlash] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const dots = useRef(0)
  const [dotStr, setDotStr] = useState("")

  // Animated ellipsis
  useEffect(() => {
    const id = setInterval(() => {
      dots.current = (dots.current + 1) % 4
      setDotStr(".".repeat(dots.current))
    }, 400)
    return () => clearInterval(id)
  }, [])

  // Load stats from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem("chatStats")
    if (!raw) {
      router.replace("/")
      return
    }
    const parsed: ChatStats = JSON.parse(raw)
    setStats(parsed)

    // Fetch roasts
    fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    })
      .then((r) => r.json())
      .then((data: Roasts) => {
        setRoasts(data)
        setLoading(false)
      })
      .catch(() => {
        setRoasts(FALLBACK_ROASTS)
        setLoading(false)
      })
  }, [router])

  const triggerFlash = useCallback(() => {
    setFlash(true)
    setTimeout(() => setFlash(false), 120)
  }, [])

  const goNext = useCallback(() => {
    if (currentCard < TOTAL_CARDS - 1) {
      triggerFlash()
      setTimeout(() => setCurrentCard((c) => c + 1), 20)
    }
  }, [currentCard, triggerFlash])

  const goPrev = useCallback(() => {
    if (currentCard > 0) {
      triggerFlash()
      setTimeout(() => setCurrentCard((c) => c - 1), 20)
    }
  }, [currentCard, triggerFlash])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext() }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev() }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [goNext, goPrev])

  // Touch navigation
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 40) {
      if (dx > 0) { goNext() } else { goPrev() }
    }
    touchStartX.current = null
  }

  // Click navigation — left 33% = prev, right 66% = next
  function handleClick(e: React.MouseEvent) {
    const x = e.clientX / window.innerWidth
    if (x < 0.33) { goPrev() } else { goNext() }
  }

  if (loading || !stats || !roasts) {
    return (
      <div className="bg-grid" style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px"
      }}>
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
            ANALYSING CHAOS{dotStr}
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
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
        `}</style>
      </div>
    )
  }

  const cardProps = { stats, roasts, flash }

  const cards = [
    <IntroCard key="intro" {...cardProps} />,
    <TotalMessages key="total" {...cardProps} />,
    <TopTexter key="top" {...cardProps} />,
    <MostUsedWord key="word" {...cardProps} />,
    <NightOwl key="night" {...cardProps} />,
    <LeftOnRead key="lor" {...cardProps} />,
    <MostDramatic key="drama" {...cardProps} />,
    <FinaleCard key="finale" {...cardProps} />,
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ProgressBar total={TOTAL_CARDS} current={currentCard} />
      {cards[currentCard]}
    </div>
  )
}
