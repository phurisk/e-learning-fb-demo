"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const safeMessage =
    typeof error?.message === "string"
      ? error.message
      : error?.message
        ? "เกิดข้อผิดพลาดไม่ทราบสาเหตุ"
        : "ไม่ทราบสาเหตุ กรุณาลองอีกครั้งในภายหลัง"

  return (
    <html lang="th">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
          <div className="w-full max-w-xl text-center space-y-4">
            <img src="/new-logo.png" alt="logo" className="w-24 h-24 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">เกิดข้อผิดพลาดในระบบ</h1>
              <p className="text-gray-600 break-all">{safeMessage}</p>
            </div>
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
            >
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
