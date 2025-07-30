import { Button } from "@/components/ui/button";
import { PaginationProps } from "@/types/order";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  hasNextPage,
  hasPreviousPage,
  loading,
  onPageChange,
  onNextPage,
  onPreviousPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          variant="outline"
          onClick={onPreviousPage}
          disabled={!hasPreviousPage || loading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={onNextPage}
          disabled={!hasNextPage || loading}
        >
          Next
        </Button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> results
          </p>
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousPage}
              disabled={!hasPreviousPage || loading}
              className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-l-md"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  disabled={loading}
                  className="relative inline-flex cursor-pointer items-center px-4 py-2 -ml-px"
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={!hasNextPage || loading}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md -ml-px"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
