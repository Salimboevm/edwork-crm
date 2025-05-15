'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { unstable_after as after } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// Course creation schema
const courseSchema = z.object({
  courseName: z.string().min(1, 'Course name is required'),
  courseNameUz: z.string().min(1, 'Uzbek course name is required'),
  level: z.string().min(1, 'Level is required'),
  universityId: z.string().min(1, 'University is required'),
  campus: z.string().min(1, 'Campus is required'),
  tuitionFee: z.coerce.number().min(0, 'Tuition fee must be a positive number'),
  currency: z.string().default('GBP'),
  selectedIntake: z.string().min(1, 'Intake is required'),
  selectedDuration: z.string().min(1, 'Duration is required'),
  submissionDeadline: z.string().optional().transform(val => val ? new Date(val) : undefined),
  offerTAT: z.coerce.number().optional(),
  expressOffer: z.boolean().default(false),
  modeOfStudy: z.string().optional(),
});

// Create course action
export async function createCourse(formData: FormData) {
  // Authentication check
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  
  // Parse form data
  const rawData = Object.fromEntries(formData.entries());
  rawData.expressOffer = rawData.expressOffer === 'on';
  
  // Validate data
  const validatedData = courseSchema.parse(rawData);
  
  try {
    // Create course in database
    const course = await db.course.create({
      data: {
        ...validatedData,
        tuitionFee: validatedData.tuitionFee.toString(),
      },
    });
    
    // Background task - log activity
    after(async () => {
      await db.userActivity.create({
        data: {
          userId: session.user.id,
          type: 'CREATE_COURSE',
          details: `Created course: ${course.courseName} (${course.id})`,
        },
      });
    });
    
    revalidatePath('/courses');
    return { success: true, course };
  } catch (error) {
    console.error('Failed to create course:', error);
    throw new Error('Failed to create course. Please try again.');
  }
}

// Get courses with filtering
export async function getCourses(
  searchParams: Record<string, string | string[] | undefined> = {}
) {
  const session = await auth();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  const {
    query,
    type = 'smart',
    level,
    university,
    minFee,
    maxFee,
    intake,
    duration,
    expressOffer,
    page = '1',
    limit = '10',
  } = searchParams;
  
   // Build where clause
  const where: any = {};
  
  if (query) {
    const searchString = query as string;
    
    if (type === 'exact') {
      where.courseName = searchString;
    } else {
      // Use standard contains search - more complex searches would require raw SQL
      where.OR = [
        {
          courseName: {
            contains: searchString,
            mode: 'insensitive',
          }
        },
        {
          courseNameUz: {
            contains: searchString,
            mode: 'insensitive',
          }
        },
        {
          description: {
            contains: searchString,
            mode: 'insensitive',
          }
        },
        {
          descriptionUz: {
            contains: searchString,
            mode: 'insensitive',
          }
        }
      ];
    }
  }
  
  if (level) {
    where.level = level as string;
  }
  
  if (university) {
    where.university = {
      name: {
        contains: university as string,
        mode: 'insensitive',
      },
    };
  }
  
  if (minFee) {
    where.tuitionFee = {
      ...where.tuitionFee,
      gte: parseFloat(minFee as string),
    };
  }
  
  if (maxFee) {
    where.tuitionFee = {
      ...where.tuitionFee,
      lte: parseFloat(maxFee as string),
    };
  }
  
  if (intake) {
    where.selectedIntake = intake as string;
  }
  
  if (duration) {
    where.selectedDuration = duration as string;
  }
  
  if (expressOffer) {
    where.expressOffer = expressOffer === 'true';
  }
  
  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = Math.min(parseInt(limit as string), 50);
  const skip = (pageNum - 1) * limitNum;
  
  try {
    // Execute query with proper pagination and eager loading
    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        include: {
          university: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      db.course.count({ where }),
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum);
    
    return {
      courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses. Please try again.');
  }
}

// Get universities
export async function getUniversities() {
  try {
    const universities = await db.university.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return universities;
  } catch (error) {
    console.error('Error fetching universities:', error);
    throw new Error('Failed to fetch universities. Please try again.');
  }
}

// Delete course action
export async function deleteCourse(id: string) {
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  
  try {
    // Delete course
    await db.course.delete({
      where: {
        id,
      },
    });
    
    // Log activity
    after(async () => {
      await db.userActivity.create({
        data: {
          userId: session.user.id,
          type: 'DELETE_COURSE',
          details: `Deleted course: ${id}`,
        },
      });
    });
    
    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete course:', error);
    throw new Error('Failed to delete course. Please try again.');
  }
}