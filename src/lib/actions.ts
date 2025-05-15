'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { unstable_after as after } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// New Next.js 15 feature: 'use server' directive automatically applies to all exports

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
  submissionDeadline: z.date().optional(),
  offerTAT: z.coerce.number().optional(),
  expressOffer: z.boolean().default(false),
  modeOfStudy: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

// Create course action
export async function createCourse(formData: FormData) {
  // Authentication check
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  
  // Parse and validate form data
  const parsed = Object.fromEntries(formData.entries());
  
  // Handle dates specifically
  if (parsed.submissionDeadline) {
    parsed.submissionDeadline = new Date(parsed.submissionDeadline as string);
  }
  
  // Handle boolean fields
  parsed.expressOffer = parsed.expressOffer === 'on';

  // Validate using zod
  const validatedData = courseSchema.parse(parsed);
  
  try {
    // Create course in database
    await db.course.create({
      data: validatedData,
    });
    
    // New in Next.js 15: Use after() for non-blocking background tasks
    after(() => {
      console.log(`Course created: ${validatedData.courseName}`);
      
      // Additional background tasks like sending notifications
      // This runs after the response is sent to the client
    });
    
    // Revalidate courses page to reflect changes immediately
    revalidatePath('/courses');
    
    // Redirect to courses page
    redirect('/courses');
  } catch (error) {
    console.error('Failed to create course:', error);
    throw new Error('Failed to create course. Please try again.');
  }
}

// Get courses with filtering (server action)
export async function getCourses(
  searchParams: Record<string, string | string[] | undefined> = {}
) {
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
  
  // Build where clause for database query
  const where: any = {};
  
  if (query) {
    if (type === 'exact') {
      where.courseName = query;
    } else {
      where.courseName = {
        contains: query,
        mode: 'insensitive',
      };
    }
  }
  
  if (level) {
    where.level = level;
  }
  
  if (university) {
    where.university = {
      name: {
        contains: university,
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
    where.selectedIntake = intake;
  }
  
  if (duration) {
    where.selectedDuration = duration;
  }
  
  if (expressOffer) {
    where.expressOffer = expressOffer === 'true';
  }
  
  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = Math.min(parseInt(limit as string), 50); // Cap at 50 items per page
  const skip = (pageNum - 1) * limitNum;
  
  // New in Next.js 15: use cache directive (when imported)
  // Using React's cache() for memoization
  // This is automatically applied for server components
  
  try {
    // Execute query
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
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    return {
      courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses. Please try again.');
  }
}

// Delete course action
export async function deleteCourse(formData: FormData) {
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  
  const courseId = formData.get('courseId') as string;
  
  if (!courseId) {
    throw new Error('Course ID is required');
  }
  
  try {
    await db.course.delete({
      where: {
        id: courseId,
      },
    });
    
    // Revalidate courses page
    revalidatePath('/courses');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete course:', error);
    throw new Error('Failed to delete course. Please try again.');
  }
}