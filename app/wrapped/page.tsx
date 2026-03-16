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
import EmojiKing from "@/components/cards/EmojiKing"
import SlowTexter from "@/components/cards/SlowTexter"
import Lurker from "@/components/cards/Lurker"
import ConvoStarter from "@/components/cards/ConvoStarter"
import CompatibilityCard from "@/components/cards/CompatibilityCard"
import MorningVsNight from "@/components/cards/MorningVsNight"
import LongestStreak from "@/components/cards/LongestStreak"
import LongestMessage from "@/components/cards/LongestMessage"

const TOTAL_CARDS = 16

const FALLBACK_ROASTS: Roasts = {
  introTagline: "you people never stop yapping",
  totalMessagesRoast: "therapy would have been cheaper",
  topTexterRoast: "get some hobbies, seriously",
  topWordRoast: "vocabulary of a golden retriever",
  nightOwlRoast: "sleep is for the unbothered",
  leftOnReadRoast: "chronic ghoster, no remorse",
  dramaticRoast: "shakespearean levels of unhinged",
  finaleRoast: "touch grass. immediately.",
  emojiKingRoast: "grew up speaking emoji",
  slowTexterRoast: "replies faster than a glacier moves",
  lurkerRoast: "witnesses everything, contributes nothing",
  convoStarterRoast: "desperately filling the silence since forever",
  morningVsNightRoast: "some of you have never seen a sunrise",
  longestStreakRoast: "parasocial relationship with a group chat",
  longestMessageRoast: "essays in whatsapp. unhinged.",
  vibeCheckLabel: "UNHINGED",
  vibeCheckCaption: "no further explanation needed",
  compatPair: "Unknown & Unknown",
  compatScore: 7,
  compatReason: "mutually chaotic, oddly enough it works",
  compatWorstPair: "Unknown & Unknown",
}

type ChatSession = { stats: ChatStats; roasts: Roasts }

function buildCards(stats: ChatStats, roasts: Roasts) {
  const props = { stats, roasts, flash: false }
  return [
    <IntroCard key="intro" {...props} />,
    <TotalMessages key="total" {...props} />,
    <TopTexter key="top" {...props} />,
    <MostUsedWord key="word" {...props} />,
    <EmojiKing key="emoji" {...props} />,
    <NightOwl key="night" {...props} />,
    <MorningVsNight key="morning" {...props} />,
    <LeftOnRead key="lor" {...props} />,
    <MostDramatic key="drama" {...props} />,
    <SlowTexter key="slow" {...props} />,
    <Lurker key="lurker" {...props} />,
    <ConvoStarter key="convo" {...props} />,
    <LongestStreak key="streak" {...props} />,
    <LongestMessage key="longmsg" {...props} />,
    <CompatibilityCard key="compat" roasts={roasts} flash={false} />,
    <FinaleCard key="finale" {...props} />,
  ]
}

export default function WrappedPage() {
  const router = useRouter()

  const [session, setSession] = useState<ChatSession | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentCard, setCurrentCard] = useState(0)
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null)
  const [animating, setAnimating] = useState(false)
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

  // Load stats from sessionStorage and fetch roasts
  useEffect(() => {
    const raw = sessionStorage.getItem("chatStats")
    if (!raw) {
      router.replace("/")
      return
    }

    const stats: ChatStats = JSON.parse(raw)

    fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    })
      .then((r) => r.json())
      .catch(() => FALLBACK_ROASTS)
      .then((roasts: Roasts) => {
        setSession({ stats, roasts })
        setLoading(false)
      })
  }, [router])

  // Navigate with smooth animation
  const navigate = useCallback((dir: "left" | "right") => {
    if (animating) return
    if (!session) return
    const total = TOTAL_CARDS
    if (dir === "right" && currentCard >= total - 1) return
    if (dir === "left" && currentCard <= 0) return

    setAnimDir(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrentCard((c) => (dir === "right" ? c + 1 : c - 1))
      setAnimDir(null)
      setTimeout(() => setAnimating(false), 50)
    }, 280)
  }, [animating, currentCard, session])

  const goNext = useCallback(() => navigate("right"), [navigate])
  const goPrev = useCallback(() => navigate("left"), [navigate])

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

  function handleClick(e: React.MouseEvent) {
    const x = e.clientX / window.innerWidth
    if (x < 0.33) { goPrev() } else { goNext() }
  }

  if (loading || !session) {
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

  const cards = buildCards(session.stats, session.roasts)

  // Animation classes
  const outClass = animDir === "right" ? "card-exit-left" : "card-exit-right"
  const inClass = animDir === "right" ? "card-enter-right" : "card-enter-left"

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

      {/* Animated card wrapper */}
      <div
        key={currentCard}
        className={animating && animDir ? outClass : inClass}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        {cards[currentCard]}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(60%) scale(0.95); opacity: 0; }
          to   { transform: translateX(0)   scale(1);    opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-60%) scale(0.95); opacity: 0; }
          to   { transform: translateX(0)    scale(1);    opacity: 1; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0)    scale(1);    opacity: 1; }
          to   { transform: translateX(-60%) scale(0.95); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0)   scale(1);    opacity: 1; }
          to   { transform: translateX(60%) scale(0.95); opacity: 0; }
        }
        .card-enter-right {
          animation: slideInRight 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .card-enter-left {
          animation: slideInLeft 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .card-exit-left {
          animation: slideOutLeft 0.28s cubic-bezier(0.55, 0, 1, 0.45) forwards;
          pointer-events: none;
        }
        .card-exit-right {
          animation: slideOutRight 0.28s cubic-bezier(0.55, 0, 1, 0.45) forwards;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
