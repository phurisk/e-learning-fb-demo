"use client"

import { useEffect } from "react"

// error.tsx เป็น Error Boundary ระดับเส้นทาง (Route) ที่อยู่ใต้ layout
// ต้องไม่ห่อด้วย <html>/<body> เพื่อหลีกเลี่ยงการซ้อนแท็กกับ layout
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const safeMessage =
    typeof error?.message === "string"
      ? error.message
      : error?.message
        ? "เกิดข้อผิดพลาดไม่ทราบสาเหตุ"
        : "ไม่ทราบสาเหตุ"

  useEffect(() => {
    // Log the error to an error reporting service
    if (typeof window !== "undefined") {
      console.error(error)
    }
  }, [error])
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="w-32 h-32 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-4xl" role="img" aria-label="warning">
            ⚠️
          </span>
        </div>
        <h1 className="text-2xl font-bold">เกิดข้อผิดพลาดภายในระบบ</h1>
        <p className="text-gray-600 break-all max-w-xl mx-auto">{safeMessage}</p>
        <button
          onClick={() => reset()}
          className="inline-block border px-4 py-2 rounded-md hover:bg-gray-50"
        >
          ลองอีกครั้ง
        </button>
      </div>
    </div>
  )
}
