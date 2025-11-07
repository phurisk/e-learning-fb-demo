"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="th">
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; }
          .container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
          .content { text-align: center; max-width: 36rem; }
          h1 { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; }
          p { color: #4b5563; margin-bottom: 1rem; word-break: break-all; }
          button { display: inline-block; border: 1px solid #d1d5db; padding: 0.5rem 1rem; border-radius: 0.375rem; background: white; cursor: pointer; }
          button:hover { background: #f3f4f6; }
        `}} />
      </head>
      <body>
        <div className="container">
          <div className="content">
            <h1>เกิดข้อผิดพลาด</h1>
            <p>{error?.message || "ไม่ทราบสาเหตุ"}</p>
            <button onClick={() => reset()}>ลองอีกครั้ง</button>
          </div>
        </div>
      </body>
    </html>
  )
}
