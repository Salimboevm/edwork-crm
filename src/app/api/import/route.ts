// CSV Import API Route - /src/app/api/import/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    );
  }
  
  // Handle CSV file
  try {
    // Read file content
    const fileBuffer = await file.arrayBuffer();
    const fileContent = new TextDecoder().decode(fileBuffer);
    
    // Parse CSV
    const records = parseCSV(fileContent);
    
    // In a real application, you would:
    // 1. Validate the data
    // 2. Process the records
    // 3. Save to the database
    
    return NextResponse.json({ 
      success: true,
      message: 'File imported successfully',
      count: records.length
    });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    return NextResponse.json(
      { error: 'Failed to process the file' },
      { status: 500 }
    );
  }
}

function parseCSV(csvContent: string) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    
    if (values.length === headers.length) {
      const record: Record<string, string> = {};
      
      for (let j = 0; j < headers.length; j++) {
        record[headers[j].trim()] = values[j].trim();
      }
      
      records.push(record);
    }
  }
  
  return records;
}