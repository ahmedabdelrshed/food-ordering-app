import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@prisma/client";
import { getStatusSelectOptions } from "./OrderStatus";

export const StatusSelect = React.memo(function StatusSelect({
  value,
  onValueChange,
  onClick,
}: {
  value: OrderStatus;
  onValueChange: (val: OrderStatus) => void;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v as OrderStatus)}
    >
      <SelectTrigger
        className="block w-full text-xs border-gray-300 rounded-md"
        onClick={onClick}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {getStatusSelectOptions().map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
});
