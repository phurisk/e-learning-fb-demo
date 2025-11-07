import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // สร้างรหัสผ่าน hash สำหรับ admin
  const hashedPassword = await bcrypt.hash('123456', 10);

  // สร้าง user admin
  await prisma.user.upsert({
    where: { email: 'admin@ptttutor.com' },
    update: {},
    create: {
      email: 'admin@ptttutor.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // สร้าง categories ตัวอย่าง
  const categories = [
    { name: 'ฟิสิกส์', description: 'คอร์สเรียนฟิสิกส์' },
    { name: 'คณิตศาสตร์', description: 'คอร์สเรียนคณิตศาสตร์' },
    { name: 'เคมี', description: 'คอร์สเรียนเคมี' },
    { name: 'ชีววิทยา', description: 'คอร์สเรียนชีววิทยา' },
  ];

  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: category.name }
    });
    
    if (!existingCategory) {
      await prisma.category.create({
        data: category
      });
    }
  }

  // สร้าง ebook categories ตัวอย่าง
  const ebookCategories = [
    { name: 'หนังสือเรียน', description: 'หนังสือเรียนต่างๆ' },
    { name: 'แบบฝึกหัด', description: 'แบบฝึกหัดและแบบทดสอบ' },
    { name: 'เอกสารประกอบ', description: 'เอกสารประกอบการเรียน' },
  ];

  for (const category of ebookCategories) {
    const existingCategory = await prisma.ebookCategory.findFirst({
      where: { name: category.name }
    });
    
    if (!existingCategory) {
      await prisma.ebookCategory.create({
        data: category
      });
    }
  }

  // สร้าง post types ตัวอย่าง
  const postTypes = [
    { name: 'ข่าวสาร', description: 'ข่าวสารและประกาศ' },
    { name: 'บทความ', description: 'บทความเกี่ยวกับการศึกษา' },
    { name: 'เคล็ดลับ', description: 'เคล็ดลับการเรียน' },
  ];

  for (const postType of postTypes) {
    const existingPostType = await prisma.postType.findFirst({
      where: { name: postType.name }
    });
    
    if (!existingPostType) {
      await prisma.postType.create({
        data: postType
      });
    }
  }

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });