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

interface StatusSelectProps {
  value: OrderStatus;
  onValueChange: (value: OrderStatus) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export function StatusSelect({
  value,
  onValueChange,
  onClick,
}: StatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onValueChange(value as OrderStatus)}
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
}
