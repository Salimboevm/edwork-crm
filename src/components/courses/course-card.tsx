// Course Card Component - /src/components/courses/course-card.tsx
import Link from 'next/link';
import Image from 'next/image';

export function CourseCard({ 
  course, 
  dictionary,
  locale
}: { 
  course: any; 
  dictionary: any;
  locale: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {course.courseName}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {course.level}
              {course.offerTAT && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Offer TAT: {course.offerTAT} weeks
                </span>
              )}
            </p>
            
            <div className="flex items-center mt-2 mb-4">
              <Image
                src="/university-logo.png"
                alt={course.university}
                width={40}
                height={40}
                className="rounded-md"
              />
              <div className="ml-2">
                <p className="text-sm font-medium">{course.university}</p>
                <p className="text-xs text-gray-500">Campus: {course.campus}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end justify-between">
            <div className="text-right mb-4">
              <p className="text-sm text-gray-500">Per year</p>
              <p className="text-lg font-bold text-purple-700">
                {course.currency} {parseFloat(course.tuitionFee).toLocaleString()}
              </p>
            </div>
            
            <div className="flex flex-col w-full md:w-auto gap-2">
              <button className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                {dictionary.startApplication}
              </button>
              
              <Link
                href={`/${locale}/courses/${course.id}`}
                className="w-full text-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {dictionary.details}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
