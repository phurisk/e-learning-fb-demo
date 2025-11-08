"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import http from "@/lib/http"
import { bannerSlides as fallbackSlides } from "@/lib/dummy-data"

type HeroSlide = {
  id: string | number
  desktop: string
  mobile: string
}

export default function HeroBanner() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch slides from API (client-side)
  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          const params = new URLSearchParams({
            postType: "ป้ายประกาศหลัก",
            limit: "10"
          })
          const res = await http.get(`/api/posts?${params.toString()}`)
          const json: any = res.data || null
          const items = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []

          const now = new Date()
          const activePublished = items.filter((item: any) => {
            const isActive = item?.isActive !== false
            const publishedAt = item?.publishedAt ? new Date(item.publishedAt) : null
            return (
              item?.postType?.name === "ป้ายประกาศหลัก" &&
              isActive &&
              (!publishedAt || publishedAt <= now)
            )
          })

          const mapped: HeroSlide[] = activePublished
            .map((p: any, idx: number) => ({
              id: p?.id ?? idx,
              desktop: p?.imageUrl || p?.imageUrlMobileMode || "",
              mobile: p?.imageUrlMobileMode || p?.imageUrl || "",
            }))
            .filter((slide: HeroSlide) => !!(slide.desktop || slide.mobile))

          if (!mounted) return

          if (res.status >= 200 && res.status < 300 && mapped.length > 0) {
            setSlides(mapped)
            console.log('✅ [HeroBanner] Loaded', mapped.length, 'slides from API')
          } else {
            // Use fallback slides
            const fallback = (fallbackSlides || []).map((p: any, idx: number) => ({
              id: p?.id ?? idx,
              desktop: p?.imageUrl || p?.imageUrlMobileMode || "",
              mobile: p?.imageUrlMobileMode || p?.imageUrl || "",
            }))
            setSlides(fallback)
            console.log('⚠️ [HeroBanner] Using fallback slides')
          }
        } catch (error) {
          console.error('❌ [HeroBanner] Error fetching slides:', error)
          // Use fallback slides on error
          const fallback = (fallbackSlides || []).map((p: any, idx: number) => ({
            id: p?.id ?? idx,
            desktop: p?.imageUrl || p?.imageUrlMobileMode || "",
            mobile: p?.imageUrlMobileMode || p?.imageUrl || "",
          }))
          setSlides(fallback)
        } finally {
          if (mounted) setLoading(false)
        }
      })()

    return () => {
      mounted = false
    }
  }, [])

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
    ; (mql as any).addListener?.(onChange)
    return () => {
      ; (mql as any).removeListener?.(onChange)
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

  const pickSrc = (slide: HeroSlide) => {
    return isMobile ? slide.mobile || slide.desktop : slide.desktop || slide.mobile
  }

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
                className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"
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
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentSlide ? "bg-yellow-400" : "bg-white/80"
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
