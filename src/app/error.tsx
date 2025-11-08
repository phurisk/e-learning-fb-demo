"use client"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="th">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
            <p className="text-lg mb-4">{error.message || "เกิดข้อผิดพลาดบางอย่าง"}</p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
