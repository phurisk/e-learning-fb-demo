"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/sections/footer"
import { motion } from "framer-motion"
import Image from "next/image"


const studyPlans = [
  {
    id: 1,
    title: "แผนการเรียน ม.4 เทอม 1",
    image: "/study-plan-m4-term1-portrait.png",
    orientation: "portrait",
  },
  {
    id: 2,
    title: "แผนการเรียน ม.4 เทอม 2",
    image: "/study-plan-m4-term2-landscape.png",
    orientation: "landscape",
  },
  {
    id: 3,
    title: "แผนการเรียน ม.5 เทอม 1",
    image: "/study-plan-m5-term1-portrait.png",
    orientation: "portrait",
  },
  {
    id: 4,
    title: "แผนการเรียน ม.5 เทอม 2",
    image: "/study-plan-m5-term2-landscape.png",
    orientation: "landscape",
  },
  {
    id: 5,
    title: "แผนการเรียน ม.6 เทอม 1",
    image: "/study-plan-m6-term1-portrait.png",
    orientation: "portrait",
  },
  {
    id: 6,
    title: "แผนการเรียน ม.6 เทอม 2",
    image: "/study-plan-m6-term2-landscape.png",
    orientation: "landscape",
  },
  {
    id: 7,
    title: "แผนการเรียนสอบเข้ามหาวิทยาลัย",
    image: "/study-plan-university-entrance-portrait.png",
    orientation: "portrait",
  },
  {
    id: 8,
    title: "แผนการเรียนเตรียมสอวน.",
    image: "/study-plan-science-olympiad-landscape.png",
    orientation: "landscape",
  },
]

export default function StudyPlansPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
       
        <motion.section
          className="py-16 bg-gradient-to-r from-blue-50 to-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">แผนการเรียน</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              แผนการเรียนที่ออกแบบมาเป็นพิเศษสำหรับนักเรียนแต่ละระดับชั้น เพื่อให้ได้ผลลัพธ์ที่ดีที่สุด
            </p>
          </div>
        </motion.section>

      
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
              {studyPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={`
                    relative w-full mx-auto
                    ${plan.orientation === "portrait" ? "max-w-md aspect-[3/4]" : "max-w-2xl aspect-[4/3]"}
                  `}
                  >
                    <Image
                      src={plan.image || "/placeholder.svg"}
                      alt={plan.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                 
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-end">
                      <div className="p-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-semibold text-sm md:text-base">{plan.title}</h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

       
        <motion.section
          className="py-16 bg-gray-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">จุดเด่นของแผนการเรียน</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">เนื้อหาครบถ้วน</h3>
                <p className="text-gray-600">ครอบคลุมเนื้อหาตามหลักสูตรและข้อสอบ</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">เป้าหมายชัดเจน</h3>
                <p className="text-gray-600">แผนการเรียนที่มีเป้าหมายและผลลัพธ์ที่ชัดเจน</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">จัดเวลาเหมาะสม</h3>
                <p className="text-gray-600">การจัดเวลาเรียนที่เหมาะสมกับนักเรียนแต่ละระดับ</p>
              </div>
            </div>
          </div>
        </motion.section>

      
        <motion.section
          className="py-16 bg-yellow-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">พร้อมเริ่มต้นแผนการเรียนของคุณแล้วหรือยัง?</h2>
            <p className="text-lg text-gray-700 mb-8">ปรึกษาแผนการเรียนที่เหมาะสมกับคุณ</p>
            <button className="bg-white text-yellow-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              ปรึกษาแผนการเรียน
            </button>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  )
}
