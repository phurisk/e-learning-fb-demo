import { bannerSlides as fallbackSlides } from "@/lib/dummy-data"

export type HeroSlide = {
  id: string | number
  desktop: string
  mobile: string
}

const TARGET_NAME = "ป้ายประกาศหลัก"

function normalizeSlides(source: any[] | undefined | null): HeroSlide[] {
  if (!Array.isArray(source)) return []

  return source
    .map((p, idx) => {
      const id = p?.id ?? idx
      const desktop = p?.imageUrl || p?.imageUrlMobileMode || ""
      const mobile = p?.imageUrlMobileMode || p?.imageUrl || ""
      return { id, desktop, mobile }
    })
    .filter((slide) => !!(slide.desktop || slide.mobile))
}

function fallbackHeroSlides(): HeroSlide[] {
  return normalizeSlides(fallbackSlides ?? [])
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const isDev = process.env.NODE_ENV === 'development'


  let baseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL

  
  if (!baseUrl) {
    if (process.env.VERCEL_URL && process.env.VERCEL_URL !== 'undefined') {
      baseUrl = `https://${process.env.VERCEL_URL}`
    } else {
      // Default to localhost for development
      baseUrl = 'http://localhost:3000'
    }
  }

  if (isDev) {
    console.log('🎯 [Hero Banner] Using base URL:', baseUrl)
  }

  try {
    const url = new URL("/api/posts", baseUrl)
    url.searchParams.set("postType", TARGET_NAME)
    url.searchParams.set("limit", "10")

    if (isDev) {
      console.log('🎯 [Hero Banner] Fetching from:', url.toString())
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      console.warn(`⚠️ [Hero Banner] API returned ${res.status}, using fallback`)
      return fallbackHeroSlides()
    }

    const json = await res.json().catch(() => ({}))
    const items = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : []

    const now = new Date()
    const activePublished = items.filter((item: any) => {
      const isActive = item?.isActive !== false
      const publishedAt = item?.publishedAt ? new Date(item.publishedAt) : null
      return (
        item?.postType?.name === TARGET_NAME &&
        isActive &&
        (!publishedAt || publishedAt <= now)
      )
    })

    const mapped = normalizeSlides(activePublished)

    if (isDev) {
      console.log('✅ [Hero Banner] Loaded', mapped.length, 'slides')
    }

    return mapped.length > 0 ? mapped : fallbackHeroSlides()
  } catch (error) {
    console.error('❌ [Hero Banner] Error:', error instanceof Error ? error.message : 'Unknown error')
    return fallbackHeroSlides()
  }
}
