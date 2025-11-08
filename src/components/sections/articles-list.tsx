"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import http from "@/lib/http"
import { articles as fallbackArticles } from "@/lib/dummy-data"

const PAGE_SIZE = 9
const FETCH_LIMIT = 200

type ArticleItem = {
  id: string | number
  slug: string
  title: string
  excerpt: string
  date: string
  imageDesktop: string
  imageMobile: string
}

function deriveExcerpt(input?: string, max = 160) {
  if (!input) return ""
  const text = String(input)
    .replace(/\r\n|\n|\r/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > max ? text.slice(0, max - 1) + "…" : text
}

export default function ArticlesList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  const page = Math.max(1, Number(searchParams.get("page") || "1"))

  // Fetch articles from API
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const params = new URLSearchParams({ 
          postType: "บทความ", 
          limit: String(FETCH_LIMIT) 
        })
        const res = await http.get(`/api/posts?${params.toString()}`)
        const json: any = res.data || null
        const items = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []

        const mapped: ArticleItem[] = items
          .filter((p: any) => p?.postType?.name === "บทความ")
          .map((p: any, idx: number) => {
            const desktop = p?.imageUrl || p?.imageUrlMobileMode || ""
            const mobile = p?.imageUrlMobileMode || p?.imageUrl || ""
            const excerpt = p?.excerpt || deriveExcerpt(p?.content, 180)
            return {
              id: p?.id ?? idx,
              slug: p?.slug || "",
              title: p?.title || "",
              imageDesktop: desktop,
              imageMobile: mobile,
              excerpt: excerpt || "",
              date: p?.publishedAt
                ? new Date(p.publishedAt).toISOString()
                : new Date().toISOString(),
            }
          })
          .filter((a) => !!(a.imageDesktop || a.imageMobile))

        if (!mounted) return

        if (res.status >= 200 && res.status < 300 && mapped.length > 0) {
          const sorted = [...mapped].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setArticles(sorted)
          setUsingFallback(false)
          console.log('✅ [Articles] Loaded', mapped.length, 'articles from API')
        } else {
          // Use fallback
          const fallback = fallbackArticles.map((a: any) => ({
            id: a.id,
            slug: a.slug || "",
            title: a.title || "",
            excerpt: a.excerpt || "",
            date: a.date || new Date().toISOString(),
            imageDesktop: a.image || "",
            imageMobile: a.image || "",
          }))
          setArticles(fallback)
          setUsingFallback(true)
          console.warn('⚠️ [Articles] Using fallback articles')
        }
      } catch (error) {
        console.error('❌ [Articles] Error fetching:', error)
        // Use fallback on error
        const fallback = fallbackArticles.map((a: any) => ({
          id: a.id,
          slug: a.slug || "",
          title: a.title || "",
          excerpt: a.excerpt || "",
          date: a.date || new Date().toISOString(),
          imageDesktop: a.image || "",
          imageMobile: a.image || "",
        }))
        setArticles(fallback)
        setUsingFallback(true)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const pageItems = articles.slice(start, end)

  // Redirect if page is out of range
  useEffect(() => {
    if (!loading && page > totalPages && totalPages > 0) {
      router.push(`/articles?page=${totalPages}`)
    }
  }, [page, totalPages, loading, router])

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              บทความทั้งหมด
            </h1>
            <p className="text-lg text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
            บทความทั้งหมด
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            อัปเดตความรู้ฟิสิกส์ เคล็ดลับทำข้อสอบ และแนวคิดที่ใช้ได้จริง
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageItems.map((article) => (
            <Card
              key={`${article.id}-${article.slug ?? ""}`}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white py-0"
            >
              <CardContent className="p-0">
                <Link href={article.slug ? `/articles/${article.slug}` : `#`}>
                  <div className="aspect-[16/7.5] relative overflow-hidden cursor-pointer">
                    {article.imageDesktop && (
                      <Image
                        src={article.imageDesktop}
                        alt={article.title}
                        fill
                        sizes="(min-width: 768px) 100vw, 0px"
                        className="object-cover hidden md:block group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {article.imageMobile && (
                      <Image
                        src={article.imageMobile}
                        alt={article.title}
                        fill
                        sizes="(max-width: 767px) 100vw, 0px"
                        className="object-cover md:hidden group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(article.date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <Link href={article.slug ? `/articles/${article.slug}` : `#`}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-balance group-hover:text-yellow-600 transition-colors duration-200">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 mb-6 text-pretty leading-relaxed">
                    {article.excerpt}
                  </p>

                  <Button
                    asChild
                    variant="ghost"
                    className="group/btn p-0 h-auto text-yellow-600 hover:text-yellow-700"
                  >
                    <Link href={`/articles/${article.slug}`}>
                      อ่านต่อ
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-12">
          {page <= 1 ? (
            <Button variant="outline" disabled>
              ← หน้าก่อนหน้า
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href={`/articles?page=${page - 1}`}>← หน้าก่อนหน้า</Link>
            </Button>
          )}

          <span className="text-sm text-gray-600" aria-current="page">
            หน้า {page} / {totalPages}
          </span>

          {page >= totalPages ? (
            <Button variant="outline" disabled>
              หน้าถัดไป →
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href={`/articles?page=${page + 1}`}>หน้าถัดไป →</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
