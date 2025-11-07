export default function Custom500() {
  return (
    <html lang="th">
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; }
          .container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
          .content { text-align: center; }
          .logo { width: 8rem; height: 8rem; margin: 0 auto 1rem; }
          h1 { font-size: 1.875rem; font-weight: bold; margin-bottom: 0.5rem; }
          p { color: #4b5563; margin-bottom: 1rem; }
          a { display: inline-block; border: 1px solid #d1d5db; padding: 0.5rem 1rem; border-radius: 0.375rem; text-decoration: none; color: inherit; }
          a:hover { background: #f3f4f6; }
        `}} />
      </head>
      <body>
        <div className="container">
          <div className="content">
            <img src="/new-logo.png" alt="logo" className="logo" />
            <h1>เกิดข้อผิดพลาดภายในระบบ</h1>
            <p>กรุณาลองใหม่อีกครั้ง</p>
            <a href="/">กลับหน้าแรก</a>
          </div>
        </div>
      </body>
    </html>
  )
}
