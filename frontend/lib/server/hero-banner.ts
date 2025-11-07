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
  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) {
    return fallbackHeroSlides()
  }

  try {
    const url = new URL("/api/posts", baseUrl.replace(/\/$/, ""))
    url.searchParams.set("postType", TARGET_NAME)
    url.searchParams.set("limit", "10")

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
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
    return mapped.length > 0 ? mapped : fallbackHeroSlides()
  } catch {
    return fallbackHeroSlides()
  }
}
