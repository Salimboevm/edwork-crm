// prisma/migrations/migration_script.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting seed data creation...');
    
    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        // In production, use bcrypt to hash this password
        password: '$2a$10$UldiLLMrILGsSSqBWAzRPuXGk/xh1LNmKQqPTcZgBxlTCFBrJV6Ma', // 'password123'
      },
    });
    
    console.log(`Created admin user: ${admin.id}`);
    
    // Create agent user
    const agent = await prisma.user.upsert({
      where: { email: 'agent@example.com' },
      update: {},
      create: {
        name: 'Agent User',
        email: 'agent@example.com',
        role: 'AGENT',
        // In production, use bcrypt to hash this password
        password: '$2a$10$UldiLLMrILGsSSqBWAzRPuXGk/xh1LNmKQqPTcZgBxlTCFBrJV6Ma', // 'password123'
      },
    });
    
    console.log(`Created agent user: ${agent.id}`);
    
    // Create a university
    const university = await prisma.university.upsert({
      where: { id: 'oxford-brookes' },
      update: {},
      create: {
        id: 'oxford-brookes',
        name: 'Oxford Brookes University',
        nameUz: 'Oxford Bruks Universiteti',
        country: 'United Kingdom',
        city: 'Oxford',
        website: 'https://www.brookes.ac.uk',
        description: 'Oxford Brookes University is a public research university in Oxford, England.',
        descriptionUz: 'Oxford Brookes Universiteti - Angliyaning Oksford shahrida joylashgan davlat tadqiqot universiteti.',
      },
    });
    
    console.log(`Created university: ${university.id}`);
    
    // Create courses
    const courses = [
      {
        courseName: 'MSc Data Science and Artificial Intelligence',
        courseNameUz: 'MSc Ma\'lumotlar fani va sun\'iy intellekt',
        level: 'Postgraduate',
        universityId: university.id,
        campus: 'Headington Campus, United Kingdom',
        tuitionFee: 18050,
        currency: 'GBP',
        selectedIntake: 'September 2025',
        selectedDuration: '1 year',
        offerTAT: 2,
        expressOffer: true,
      },
      {
        courseName: 'BSc (Hons) Computing',
        courseNameUz: 'BSc (Hons) Kompyuter injiniringi',
        level: 'Undergraduate',
        universityId: university.id,
        campus: 'Wheatley Campus, United Kingdom',
        tuitionFee: 16900,
        currency: 'GBP',
        selectedIntake: 'September 2025',
        selectedDuration: '3 years',
        offerTAT: 2,
        expressOffer: true,
      },
    ];
    
    for (const courseData of courses) {
      const course = await prisma.course.create({
        data: courseData,
      });
      console.log(`Created course: ${course.id}`);
    }
    
    console.log('Seed data creation completed successfully!');
  } catch (error) {
    console.error('Error during seed data creation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();