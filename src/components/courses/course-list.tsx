// Course List Component - /src/components/courses/course-list.tsx
import { CourseCard } from './course-card';

export function CourseList({ 
  courses, 
  dictionary,
  locale
}: { 
  courses: any[]; 
  dictionary: any;
  locale: string;
}) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600">{dictionary.noResults}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          dictionary={dictionary}
          locale={locale}
        />
      ))}
      
      <div className="flex justify-center mt-8">
        <nav className="inline-flex">
          <a
            href="#"
            className="px-3 py-1 text-sm rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            Prev
          </a>
          <a
            href="#"
            className="px-3 py-1 text-sm border-y border-gray-300 bg-purple-100 text-purple-800"
          >
            1
          </a>
          <a
            href="#"
            className="px-3 py-1 text-sm border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            2
          </a>
          <a
            href="#"
            className="px-3 py-1 text-sm border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            3
          </a>
          <a
            href="#"
            className="px-3 py-1 text-sm border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            4
          </a>
          <a
            href="#"
            className="px-3 py-1 text-sm border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            5
          </a>
          <a
            href="#"
            className="px-3 py-1 text-sm rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            Next
          </a>
        </nav>
      </div>
    </div>
  );
}