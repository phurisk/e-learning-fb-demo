import { getHeroSlides } from "@/lib/server/hero-banner"

export const dynamic = 'force-dynamic'

export default async function DebugBannerPage() {
  const slides = await getHeroSlides()
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🎯 Debug: Hero Banner</h1>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
          <div className="space-y-1 font-mono text-sm">
            <p>API_BASE_URL: <span className="font-bold">{process.env.API_BASE_URL || 'NOT SET'}</span></p>
            <p>NEXT_PUBLIC_API_URL: <span className="font-bold">{process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</span></p>
            <p>NODE_ENV: <span className="font-bold">{process.env.NODE_ENV}</span></p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Slides Data</h2>
          <p className="mb-2">Total slides: <span className="font-bold">{slides.length}</span></p>
          
          {slides.length === 0 ? (
            <p className="text-red-600 font-semibold">⚠️ No slides found!</p>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div key={slide.id} className="border border-gray-300 p-4 rounded">
                  <h3 className="font-semibold mb-2">Slide {index + 1} (ID: {slide.id})</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold">Desktop URL:</p>
                      <p className="break-all text-blue-600">{slide.desktop || 'NOT SET'}</p>
                      {slide.desktop && (
                        <img 
                          src={slide.desktop} 
                          alt={`Desktop ${index + 1}`}
                          className="mt-2 max-w-md border"
                          onError={(e) => {
                            e.currentTarget.style.border = '2px solid red'
                            e.currentTarget.alt = 'Failed to load'
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">Mobile URL:</p>
                      <p className="break-all text-blue-600">{slide.mobile || 'NOT SET'}</p>
                      {slide.mobile && (
                        <img 
                          src={slide.mobile} 
                          alt={`Mobile ${index + 1}`}
                          className="mt-2 max-w-xs border"
                          onError={(e) => {
                            e.currentTarget.style.border = '2px solid red'
                            e.currentTarget.alt = 'Failed to load'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Raw JSON</h2>
          <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(slides, null, 2)}
          </pre>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Check if API_BASE_URL is set correctly</li>
            <li>Verify slides are being fetched from API</li>
            <li>Check if image URLs are accessible</li>
            <li>Look at server console for detailed logs</li>
            <li>In production, make sure API_BASE_URL points to your domain</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
