
export default function LoadingArticles() {
    const skeletons = Array.from({ length: 9 })
  
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-64 mx-auto bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-80 mx-auto mt-4 bg-gray-200 rounded animate-pulse" />
          </div>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skeletons.map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="aspect-[16/10] bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-4 w-44 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-6" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
  
          <div className="flex items-center justify-center gap-3 mt-12">
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </section>
    )
  }
  