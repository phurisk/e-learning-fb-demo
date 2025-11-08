import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: /api/exams/years - get available years from exam bank
export async function GET() {
  try {
    const years = await prisma.examBank.findMany({
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Extract unique years
    const uniqueYears = [...new Set(
      years.map(exam => new Date(exam.createdAt).getFullYear())
    )].sort((a, b) => b - a);

    return NextResponse.json({
      success: true,
      data: uniqueYears,
    });
  } catch (error) {
    console.error("Error fetching exam years:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการดึงข้อมูลปี" },
      { status: 500 }
    );
  }
}