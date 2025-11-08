export default function NotFound() {
  return (
    <div className="min-h-[70vh] px-4 flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="w-32 h-32 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
          <span className="text-4xl" role="img" aria-label="book">
            📚
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-yellow-500">404</p>
          <h1 className="text-3xl font-semibold">ไม่พบหน้าที่คุณต้องการ</h1>
          <p className="text-gray-600">
            ลิงก์อาจถูกย้าย ลบออก หรือพิมพ์ไม่ถูกต้อง ลองกลับไปยังหน้าแรกแล้วค้นหาใหม่อีกครั้ง
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
        >
          กลับหน้าแรก
        </a>
      </div>
    </div>
  )
}
