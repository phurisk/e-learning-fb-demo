import HomePageClient from "@/components/home-page-client"
import { getHeroSlides } from "@/lib/server/hero-banner"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ฟิสิกส์ครูพี่เต้ย - เรียนฟิสิกส์อย่างเป็นระบบกับฟิสิกส์พี่เต้ย",
  description: "เรียนฟิสิกส์กับครูพี่เต้ย ผู้เชี่ยวชาญด้านฟิสิกส์ที่มีประสบการณ์การสอนมากมาย พร้อมเทคนิคการสอนที่เข้าใจง่าย",
  keywords: "ฟิสิกส์, กวดวิชา, ครูพี่เต้ย, เรียนฟิสิกส์, GAT, PAT, ฟิสิกส์ม.ปลาย",
}

export default async function HomePage() {
  const heroSlides = await getHeroSlides()
  return <HomePageClient heroSlides={heroSlides} />
}
