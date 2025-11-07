"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import type { HeroSlide } from "@/lib/server/hero-banner"

type HeroBannerProps = {
  slides: HeroSlide[]
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia("(max-width: 767px)")
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)

    setIsMobile(mql.matches)

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    }

    // Legacy browsers
    ;(mql as any).addListener?.(onChange)
    return () => {
      ;(mql as any).removeListener?.(onChange)
    }
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    setCurrentSlide(0)
  }, [slides])

  const pickSrc = (slide: HeroSlide) =>
    isMobile ? slide.mobile || slide.desktop : slide.desktop || slide.mobile

  const loading = slides.length === 0

  const indicators = useMemo(() => slides.map((_, index) => index), [slides])

  return (
    <section className="w-full px-2 py-1 md:py-2 md:px-8">
      <div className="relative w-full aspect-[4/5] md:aspect-[16/9] overflow-hidden rounded-xl">
        {loading && (
          <div className="absolute inset-0">
            <div className="h-full w-full banner-shimmer" />
          </div>
        )}

        {!loading &&
          slides.map((slide, index) => {
            const src = pickSrc(slide)
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt="Hero Banner"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  fetchPriority={index === currentSlide ? "high" : undefined}
                  priority={index === currentSlide}
                />
                <div className="absolute inset-0 bg-black/0" />
              </div>
            )
          })}

        {!loading && slides.length > 0 && (
          <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
            {indicators.map((index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide ? "bg-yellow-400" : "bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}

        <style jsx>{`
          .banner-shimmer {
            background: linear-gradient(
              90deg,
              rgba(229, 229, 229, 1) 0%,
              rgba(243, 244, 246, 1) 50%,
              rgba(229, 229, 229, 1) 100%
            );
            background-size: 200% 100%;
            animation: bannerShimmer 1.4s ease-in-out infinite;
          }
          @keyframes bannerShimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
