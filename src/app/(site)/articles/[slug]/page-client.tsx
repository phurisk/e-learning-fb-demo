"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import http from "@/lib/http"
import { articles as fallbackArticles } from "@/lib/dummy-data"

type ArticleContentBlock = {
  id: string
  title?: string
  description?: string
  imageUrl?: string
  author?: string
  createdAt?: string
}

type ArticleItem = {
  id: string | number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  imageDesktop: string
  imageMobile: string
  authorName?: string
  readTimeMinutes: number
  postContents: ArticleContentBlock[]
}

const FETCH_LIMIT = 200

function deriveExcerpt(input?: string, max = 160) {
  if (!input) return ""
  const text = String(input)
    .replace(/\r\n|\n|\r/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > max ? text.slice(0, max - 1) + "…" : text
}

function normalizeSlug(input?: string | null) {
  return (input ?? "").trim().toLowerCase()
}

export default function ArticleDetailClient({ slug }: { slug: string }) {
  const [article, setArticle] = useState<ArticleItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const normalizedSlug = normalizeSlug(slug)
        const params = new URLSearchParams({ 
          postType: "บทความ", 
          limit: String(FETCH_LIMIT) 
        })
        const res = await http.get(`/api/posts?${params.toString()}`)
        const json: any = res.data || null
        const list: any[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []
        
        const found =
          list.find((p) => {
            const pSlug = normalizeSlug(p?.slug)
            const typeName = (p?.postType?.name ?? "").trim()
            return pSlug === normalizedSlug && (!typeName || typeName === "บทความ")
          }) ||
          list.find((p) => normalizeSlug(p?.slug) === normalizedSlug) ||
          null

        if (!mounted) return

        if (found) {
          const desktop = found?.imageUrl || found?.imageUrlMobileMode || ""
          const mobile = found?.imageUrlMobileMode || found?.imageUrl || ""
          const excerpt = found?.excerpt || deriveExcerpt(found?.content, 180)
          const authorName = found?.author?.name || found?.authorName || "Physics Ptoey"
          const postContents: ArticleContentBlock[] = Array.isArray(found?.postContents)
            ? found.postContents.map((block: any, idx: number) => ({
                id: String(block?.id ?? `${found?.id ?? slug}-${idx}`),
                title: (block?.name ?? "").trim() || undefined,
                description: (block?.description ?? "").trim() || undefined,
                imageUrl: block?.imageUrl || undefined,
                author: block?.author || undefined,
                createdAt: block?.createdAt || undefined,
              }))
            : []

          const item: ArticleItem = {
            id: found?.id ?? slug,
            slug: found?.slug ?? slug,
            title: found?.title ?? "",
            excerpt,
            content: found?.content ?? excerpt,
            date: found?.publishedAt
              ? new Date(found.publishedAt).toISOString()
              : new Date().toISOString(),
            imageDesktop: desktop,
            imageMobile: mobile,
            authorName,
            readTimeMinutes: Math.max(
              1,
              Math.round(String(found?.content ?? "").split(/\s+/).filter(Boolean).length / 200)
            ),
            postContents,
          }
          setArticle(item)
          console.log('✅ [Article Detail] Loaded article:', item.title)
        } else {
          // Try fallback
          const fallback = fallbackArticles.find(
            (item: any) => normalizeSlug(item?.slug) === normalizedSlug
          )
          if (fallback) {
            const date = (fallback as any).date || new Date().toISOString()
            const image = (fallback as any).image || ""
            setArticle({
              id: (fallback as any).id ?? slug,
              slug: (fallback as any).slug ?? slug,
              title: (fallback as any).title ?? "",
              excerpt: (fallback as any).excerpt ?? "",
              content: (fallback as any).content ?? (fallback as any).excerpt ?? "",
              date,
              imageDesktop: image,
              imageMobile: image,
              authorName: "Physics Ptoey",
              readTimeMinutes: Math.max(
                1,
                Math.round(
                  String((fallback as any).content ?? (fallback as any).excerpt ?? "")
                    .split(/\s+/)
                    .filter(Boolean).length / 200
                )
              ),
              postContents: [],
            })
            console.warn('⚠️ [Article Detail] Using fallback article')
          } else {
            setNotFoundError(true)
          }
        }
      } catch (error) {
        console.error('❌ [Article Detail] Error:', error)
        setNotFoundError(true)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">กำลังโหลด...</p>
      </div>
    )
  }

  if (notFoundError || !article) {
    notFound()
  }

  return (
    <article className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <span>โดย {article.authorName}</span>
            </div>
            <div>
              {new Date(article.date).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div>{article.readTimeMinutes} นาที</div>
          </div>

          {/* Featured Image */}
          {(article.imageDesktop || article.imageMobile) && (
            <div className="aspect-[16/9] relative overflow-hidden rounded-xl mb-8">
              {article.imageDesktop && (
                <Image
                  src={article.imageDesktop}
                  alt={article.title}
                  fill
                  sizes="(min-width: 768px) 100vw, 0px"
                  className="object-cover hidden md:block"
                  priority
                />
              )}
              {article.imageMobile && (
                <Image
                  src={article.imageMobile}
                  alt={article.title}
                  fill
                  sizes="(max-width: 767px) 100vw, 0px"
                  className="object-cover md:hidden"
                  priority
                />
              )}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Post Contents */}
        {article.postContents && article.postContents.length > 0 && (
          <div className="mt-12 space-y-8">
            {article.postContents.map((block) => (
              <div key={block.id} className="border-t pt-8">
                {block.title && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {block.title}
                  </h2>
                )}
                {block.description && (
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: block.description }}
                  />
                )}
                {block.imageUrl && (
                  <div className="mt-4 relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={block.imageUrl}
                      alt={block.title || "Content image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
