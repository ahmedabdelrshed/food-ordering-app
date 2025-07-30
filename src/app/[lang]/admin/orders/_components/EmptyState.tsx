import React from "react";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
export const EmptyState = React.memo(function EmptyState({
  searchTerm,
  onClearSearch,
}: {
  searchTerm: string;
  onClearSearch: () => void;
}) {
  return (
    <tr>
      <td colSpan={9} className="px-6 py-12 text-center">
        <div className="text-gray-500">
          {searchTerm ? (
            <div>
              <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms.
              </p>
              <Button
                variant="outline"
                onClick={onClearSearch}
                className="mt-4"
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                No orders available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Orders will appear here when they are created.
              </p>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});
