// Data Service - /src/lib/data.ts
import { unstable_cache } from 'next/cache';

// Mock courses data based on CSV structure
const coursesData = [
  {
    id: '1',
    courseName: 'MSc Data Science and Artificial Intelligence',
    courseNameUz: 'MSc Ma\'lumotlar fani va sun\'iy intellekt',
    level: 'Postgraduate',
    university: 'Oxford Brookes University',
    universityId: '1',
    campus: 'Headington Campus, United Kingdom',
    tuitionFee: 18050,
    currency: 'GBP',
    selectedIntake: 'September 2025',
    selectedDuration: '1 year',
    submissionDeadline: '2025-08-01',
    offerTAT: 2,
    expressOffer: true
  },
  {
    id: '2',
    courseName: 'MSc International Business Management',
    courseNameUz: 'MSc Xalqaro biznes boshqaruvi',
    level: 'Postgraduate',
    university: 'Oxford Brookes University',
    universityId: '1',
    campus: 'Headington Campus, United Kingdom',
    tuitionFee: 19350,
    currency: 'GBP',
    selectedIntake: 'September 2025',
    selectedDuration: '1 year',
    submissionDeadline: '2025-08-01',
    offerTAT: 2,
    expressOffer: true
  },
  {
    id: '3',
    courseName: 'BSc (Hons) Computing (Final Year Entry)',
    courseNameUz: 'BSc (Hons) Kompyuter injiniringi (yakuniy yil)',
    level: 'Undergraduate',
    university: 'Oxford Brookes University',
    universityId: '1',
    campus: 'Wheatley Campus, United Kingdom',
    tuitionFee: 16900,
    currency: 'GBP',
    selectedIntake: 'September 2025',
    selectedDuration: '1 year',
    submissionDeadline: '2025-08-01',
    offerTAT: 2,
    expressOffer: true
  },
  {
    id: '4',
    courseName: 'BA (Hons) Business Management (Final Year Entry)',
    courseNameUz: 'BA (Hons) Biznes boshqaruvi (yakuniy yil)',
    level: 'Undergraduate',
    university: 'Oxford Brookes University',
    universityId: '1',
    campus: 'Wheatley Campus, United Kingdom',
    tuitionFee: 16300,
    currency: 'GBP',
    selectedIntake: 'September 2025',
    selectedDuration: '1 year',
    submissionDeadline: '2025-08-01',
    offerTAT: 2,
    expressOffer: true
  }
];

// Function to get all courses with filtering
export const getCourses = unstable_cache(
  async (filters: Record<string, string | string[] | undefined> = {}) => {
    // In a real app, this would fetch from a database with proper filtering
    let filteredCourses = [...coursesData];
    
    // Apply filters
    if (filters.query) {
      const query = filters.query.toString().toLowerCase();
      const type = filters.type || 'smart';
      
      if (type === 'exact') {
        filteredCourses = filteredCourses.filter(course => 
          course.courseName.toLowerCase() === query
        );
      } else {
        filteredCourses = filteredCourses.filter(course => 
          course.courseName.toLowerCase().includes(query)
        );
      }
    }
    
    if (filters.level) {
      filteredCourses = filteredCourses.filter(course => 
        course.level === filters.level
      );
    }
    
    if (filters.university) {
      filteredCourses = filteredCourses.filter(course => 
        course.university === filters.university
      );
    }
    
    if (filters.minFee) {
      const minFee = parseInt(filters.minFee.toString());
      filteredCourses = filteredCourses.filter(course => 
        course.tuitionFee >= minFee
      );
    }
    
    if (filters.maxFee) {
      const maxFee = parseInt(filters.maxFee.toString());
      filteredCourses = filteredCourses.filter(course => 
        course.tuitionFee <= maxFee
      );
    }
    
    if (filters.intake) {
      filteredCourses = filteredCourses.filter(course => 
        course.selectedIntake === filters.intake
      );
    }
    
    if (filters.duration) {
      filteredCourses = filteredCourses.filter(course => 
        course.selectedDuration === filters.duration
      );
    }
    
    if (filters.expressOffer === 'true') {
      filteredCourses = filteredCourses.filter(course => 
        course.expressOffer === true
      );
    }
    
    return filteredCourses;
  },
  ['courses'],
  { tags: ['courses'], revalidate: 3600 } // Cache for 1 hour
);

// Function to get a specific course
export const getCourse = unstable_cache(
  async (id: string) => {
    // In a real app, this would fetch from a database
    return coursesData.find(course => course.id === id);
  },
  ['course'],
  { tags: ['course'], revalidate: 3600 } // Cache for 1 hour
);
