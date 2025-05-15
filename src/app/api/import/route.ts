// Updated /src/app/api/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parse } from 'papaparse';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// CSV validation schema
const courseRowSchema = z.object({
  'Course Name': z.string().min(1, 'Course name is required'),
  'Course Name (Uzbek)': z.string().min(1, 'Uzbek course name is required'),
  'Level': z.string().min(1, 'Level is required'),
  'University': z.string().min(1, 'University is required'),
  'Campus': z.string().min(1, 'Campus is required'),
  'Tuition Fee': z.string().refine(val => !isNaN(parseFloat(val)), {
    message: 'Tuition Fee must be a valid number',
  }),
  'Currency': z.string().default('GBP'),
  'Selected Intake': z.string().min(1, 'Intake is required'),
  'Selected Duration': z.string().min(1, 'Duration is required'),
  'Submission Deadline': z.string().optional(),
  'Offer TAT': z.string().optional(),
  'Express Offer': z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Read file content
    const fileBuffer = await file.arrayBuffer();
    const fileContent = new TextDecoder().decode(fileBuffer);
    
    // Parse CSV with proper handling for common issues
    const { data, errors } = parse(fileContent, {
      header: true,
      skipEmptyLines: 'greedy',
      transform: (value) => value.trim(),
    });
    
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'CSV parsing error', 
          details: errors.map(e => ({ 
            row: e.row, 
            code: e.code, 
            message: e.message 
          }))
        },
        { status: 400 }
      );
    }
    
    // Validate rows
    const validationErrors: any[] = [];
    const validRows: any[] = [];
    
    data.forEach((row: any, index: number) => {
      try {
        courseRowSchema.parse(row);
        validRows.push(row);
      } catch (error: any) {
        validationErrors.push({
          row: index + 2, // +2 for 0-indexing and header row
          errors: error.errors,
        });
      }
    });
    
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: validationErrors,
        processedCount: 0,
      });
    }
    
    // Process valid rows
    const results = await Promise.all(
      validRows.map(async (row) => {
        // Find or create university
        const university = await db.university.upsert({
          where: { name: row['University'] },
          update: {},
          create: {
            name: row['University'],
            nameUz: row['University'], // Default to English name if not provided
            country: 'Unknown', // Default value
          },
        });
        
        // Create course
        return db.course.create({
          data: {
            courseName: row['Course Name'],
            courseNameUz: row['Course Name (Uzbek)'],
            level: row['Level'],
            universityId: university.id,
            campus: row['Campus'],
            tuitionFee: parseFloat(row['Tuition Fee']),
            currency: row['Currency'] || 'GBP',
            selectedIntake: row['Selected Intake'],
            selectedDuration: row['Selected Duration'],
            submissionDeadline: row['Submission Deadline'] 
              ? new Date(row['Submission Deadline']) 
              : undefined,
            offerTAT: row['Offer TAT'] ? parseInt(row['Offer TAT']) : undefined,
            expressOffer: row['Express Offer']?.toLowerCase() === 'yes' || row['Express Offer']?.toLowerCase() === 'true',
          },
        });
      })
    );
    
    // Log activity
    await db.userActivity.create({
      data: {
        userId: session.user.id,
        type: 'IMPORT_DATA',
        details: `Imported ${results.length} courses from CSV`,
      },
    });
    
    return NextResponse.json({
      success: true,
      processedCount: results.length,
      errors: [],
    });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    return NextResponse.json(
      { error: 'Failed to process the file', details: (error as Error).message },
      { status: 500 }
    );
  }
}