"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { TProductWithRelations } from "@/types/product";
import { Extra, Size } from "@prisma/client";
import { formatCurrency } from "@/lib/formatCurrency";

function AddToCartModel({ item }: { item: TProductWithRelations }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          className="mt-4 text-white rounded-full !px-8"
        >
          <span>Add To Cart</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex items-center">
          <Image src={item.image} alt={item.name} width={200} height={200} />
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription className="text-center">
            {item.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-10">
          <div className="space-y-4 text-center">
            <Label htmlFor="pick-size">Pick your size</Label>
            <PickSize itemPrice={item.basePrice} sizes={item.sizes}/>
          </div>
          <div className="space-y-4 text-center">
            <Label htmlFor="add-extras">Any extras?</Label>
            <Extras extras={item.extras}/>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full h-10">
            Add to cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddToCartModel;

function PickSize({ sizes, itemPrice }: { sizes: Size[]; itemPrice: number }) {
  return (
    <RadioGroup defaultValue="SMALL">
      {sizes.map((size) => (
        <div
          key={size.id}
          className="flex items-center  space-x-2 border border-gray-100 rounded-md p-4 bg-gray-50"
        >
              <RadioGroupItem
            id={size.id}
            value={size.name}
            className="text-primary border-primary cursor-pointer"
          />
          <Label htmlFor={size.id} className="cursor-pointer">
            {size.name} {formatCurrency(size.price + itemPrice)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
function Extras({extras}:{extras:Extra[]}) {
  return (
    <div className="">
      {extras.map((extra) => (
        <div
          key={extra.id}
          className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
        >
          <Checkbox className="text-primary border-primary" id={extra.id} />
          <Label
            htmlFor={extra.id}
            className="text-sm text-accent cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {extra.name} {formatCurrency(extra.price)}{" "}
          </Label>
        </div>
      ))}
    </div>
  );
}
