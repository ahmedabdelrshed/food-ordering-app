"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, XIcon, Loader2Icon } from "lucide-react";
import { SearchAndFiltersProps } from "@/types/order";

export function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  itemsPerPage,
  setItemsPerPage,
  totalCount,
  loading,
  onClearSearch,
}: SearchAndFiltersProps) {
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Section */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by Order ID, Customer, Phone, City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-12"
              autoFocus
              disabled={loading}
            />
            {loading && (
              <Loader2Icon className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
            {searchTerm && !loading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Pagination Settings */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
              disabled={loading}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                  value="5"
                >
                  5
                </SelectItem>
                <SelectItem
                  className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                  value="10"
                >
                  10
                </SelectItem>
                <SelectItem
                  className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                  value="20"
                >
                  20
                </SelectItem>
                <SelectItem
                  className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                  value="50"
                >
                  50
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-600">
            <span>Total: {totalCount} orders</span>
          </div>
        </div>
      </div>
    </div>
  );
}
