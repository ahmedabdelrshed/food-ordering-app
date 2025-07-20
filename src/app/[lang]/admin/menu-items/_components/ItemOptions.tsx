"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { Languages } from "@/lib/constants";
import { useState } from "react";
import { OptionType, Props } from "./ItemOptionGroup";

const ItemOptions = <T extends OptionType>({
  state,
  setState,
  translations,
  optionsNames,
  name,
}: Props<T>) => {
  const [names, setNames] = useState<string[]>(optionsNames);
  const addOption = () => {
    setState((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: undefined, price: 0 } as Partial<T>,
    ]);
  };
  const onChangeOption = (value: string, name: string, id: string) => {
    setState((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [name]: value };
        }
        return item;
      })
    );
    if (name === "name")
      setNames((prev) => prev.filter((name) => name !== value));
  };
  const onDeleteOption = (id: string, name: string) => {
    setState((prev) => prev.filter((item) => item.id !== id));
    if (name !== undefined) setNames((prev) => [...prev, name]);
  };
  const { lang } = useParams();
  const isAvailableOptions = state.length < optionsNames.length;
  return (
    <div>
      <ul>
        {state.map((item) => {
          return (
            <li key={item.id} className="flex gap-2 i mb-2">
              <div className="space-y-1 basis-1/2">
                <Label>name</Label>
                <Select
                  onValueChange={(value) => {
                    onChangeOption(value, "name", item.id as string);
                  }}
                  defaultValue={item.name ? item.name : "select..."}
                >
                  <SelectTrigger
                    className={` bg-white border-none  mb-4 focus:ring-0 ${
                      lang === Languages.ARABIC
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <SelectValue>
                      {item.name ? item.name : "select..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="border-none z-50 bg-white">
                    <SelectGroup className="bg-background text-accent z-50">
                      {names.map((name, index) => (
                        <SelectItem
                          key={index}
                          value={name}
                          className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
                        >
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 basis-1/2">
                <Label> Price</Label>
                <Input
                  type="number"
                  placeholder="0"
                  min={0}
                  name="price"
                  value={item.price}
                  onChange={(e) =>
                    onChangeOption(e.target.value, "price", item.id as string)
                  }
                  className="bg-white focus:!ring-0"
                />
              </div>

              <div className="flex mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onDeleteOption(item.id as string, item.name as string)
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      {isAvailableOptions && (
        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
          onClick={addOption}
        >
          <Plus />
          {name === translations.sizes
            ? translations.admin["menu-items"].addItemSize
            : translations.admin["menu-items"].addExtraItem}
        </Button>
      )}
    </div>
  );
};

export default ItemOptions;
