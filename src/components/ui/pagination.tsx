'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
// New in Next.js 15: useLinkStatus and onNavigate
import { useLinkStatus } from 'next/navigation';

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  dictionary: any;
}

export function Pagination({
  total,
  page,
  limit,
  hasNextPage,
  hasPrevPage,
  dictionary,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current search parameters
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  
  // Navigate to specific page
  const goToPage = (targetPage: number) => {
    // Use onNavigate for transition effects later
    router.push(`?${createQueryString('page', targetPage.toString())}`);
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate which pages to show
      if (page <= 3) {
        // If current page is near start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(0); // 0 indicates ellipsis
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // If current page is near end
        pages.push(1);
        pages.push(0); // 0 indicates ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // If current page is in middle
        pages.push(1);
        pages.push(0); // 0 indicates ellipsis
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push(0); // 0 indicates ellipsis
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  // New in Next.js 15: useLinkStatus to check link loading state
  const linkStatus = useLinkStatus();
  const isNavigating = linkStatus === 'pending';
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-6">
      <div className="text-sm text-gray-500 mb-4 md:mb-0">
        {dictionary.showing} {Math.min((page - 1) * limit + 1, total)} - {Math.min(page * limit, total)} {dictionary.of} {total} {dictionary.results}
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page - 1)}
          disabled={!hasPrevPage || isNavigating}
          aria-label={dictionary.previousPage}
          // New in Next.js 15: onNavigate for handling client-side navigation events
          onNavigate={(e) => {
            if (!hasPrevPage) {
              e.preventDefault();
            }
            // Add transition effects with React View Transitions API
          }}
        >
          {dictionary.prev}
        </Button>
        
        {getPageNumbers().map((pageNum, index) => (
          pageNum === 0 ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1">...</span>
          ) : (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => goToPage(pageNum)}
              disabled={isNavigating}
              aria-label={`${dictionary.page} ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </Button>
          )
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page + 1)}
          disabled={!hasNextPage || isNavigating}
          aria-label={dictionary.nextPage}
          onNavigate={(e) => {
            if (!hasNextPage) {
              e.preventDefault();
            }
            // Add transition effects
          }}
        >
          {dictionary.next}
        </Button>
      </div>
    </div>
  );
}