import { Suspense } from 'react';
import { Metadata } from 'next';
import { getCourses } from '@/lib/actions';
import { getDictionary } from '@/lib/dictionaries';
import { CourseList } from '@/components/courses/course-list';
import { CourseListSkeleton } from '@/components/courses/course-list-skeleton';
import { FilterPanel } from '@/components/filters/filter-panel';
import { SearchBar } from '@/components/ui/search-bar';

export const dynamic = 'auto';
export const dynamicParams = true;
// New in Next.js 15: Partial prerendering indicator
export const unstable_partialPrerendering = true;

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Browse and filter courses from top universities',
};

export default async function CoursesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const dict = await getDictionary(locale);
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/4">
        <FilterPanel dictionary={dict.filters} locale={locale} />
      </div>
      <div className="w-full md:w-3/4">
        <div className="mb-6">
          <SearchBar dictionary={dict.search} />
        </div>
        <div className="bg-gray-100 rounded-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">{dict.courses.heading}</h1>
            <div className="text-sm text-gray-600">
              {/* This Suspense boundary creates a partial prerendering shell */}
              <Suspense fallback={<span>{dict.courses.loading}</span>}>
                <CourseCount searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
        {/* This Suspense boundary creates a partial prerendering shell */}
        <Suspense fallback={<CourseListSkeleton />}>
          <CourseContent locale={locale} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// Dynamic component that will be streamed in
async function CourseCount({ 
  searchParams 
}: { 
  searchParams: Record<string, string | string[] | undefined> 
}) {
  const { pagination } = await getCourses(searchParams);
  
  return (
    <span>
      {pagination.total} {pagination.total === 1 ? 'course' : 'courses'}
    </span>
  );
}

// Dynamic component that will be streamed in
async function CourseContent({ 
  locale, 
  searchParams 
}: { 
  locale: string; 
  searchParams: Record<string, string | string[] | undefined> 
}) {
  const dict = await getDictionary(locale);
  const { courses, pagination } = await getCourses(searchParams);
  
  return (
    <CourseList 
      courses={courses} 
      pagination={pagination}
      dictionary={dict.courses} 
      locale={locale} 
    />
  );
}