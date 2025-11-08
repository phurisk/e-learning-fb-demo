export const dynamic = 'force-dynamic'

export default function RootNotFound() {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>404</h1>
            <p style={{ fontSize: '1.125rem' }}>ไม่พบหน้าที่คุณต้องการ</p>
          </div>
        </div>
      </body>
    </html>
  )
}
