import HomePageClient from "@/components/home-page-client"
import { getHeroSlides } from "@/lib/server/hero-banner"

export default async function HomePage() {
  const heroSlides = await getHeroSlides()
  return <HomePageClient heroSlides={heroSlides} />
}
