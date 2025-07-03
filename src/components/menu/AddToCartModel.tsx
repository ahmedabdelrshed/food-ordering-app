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

function AddToCartModel({ item }: { item: { [key: string]: string } }) {
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
            <PickSize />
          </div>
          <div className="space-y-4 text-center">
            <Label htmlFor="add-extras">Any extras?</Label>
            <Extras />
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

function PickSize() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center cursor-pointer space-x-2 border border-gray-100 rounded-md p-4 bg-gray-50">
        <RadioGroupItem value={"small"} />
        <Label>Small</Label>
      </div>
      <div className="flex items-center space-x-2 border border-gray-100 rounded-md p-4">
        <RadioGroupItem value={"Medium"} />
        <Label>Medium</Label>
      </div>
      <div className="flex items-center space-x-2 border border-gray-100 rounded-md p-4">
        <RadioGroupItem value={"Large"} />
        <Label>Large</Label>
      </div>
    </RadioGroup>
  );
}
function Extras() {
  return (
    <div className="">
      <div className="flex items-center space-x-2 border border-gray-100 rounded-md p-4">
        <Checkbox />
        <Label className="text-sm text-accent font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Cheese
        </Label>
      </div>
    </div>
  );
}
