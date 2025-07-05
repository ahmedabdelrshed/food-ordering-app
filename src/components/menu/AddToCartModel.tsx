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
import { useState } from "react";
import { addItem, CartItem } from "@/store/features/cart/cartSlice";
import { useAppDispatch } from "@/store/hooks";

function AddToCartModel({ item }: { item: TProductWithRelations }) {
    const [open, setOpen] = useState(false);

  const [selectedSize, setSelectedSize] = useState<Size>(item.sizes[0]);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useAppDispatch();
  const totalPrice = () => {
    return (
      (item.basePrice +
        selectedSize.price +
        selectedExtras.reduce((acc, extra) => acc + extra.price, 0)) *
      quantity
    );
  };
  const onAddToCart = () => {
    const product: CartItem = {
      productId: item.id,
      name: item.name,
      image: item.image,
      price: totalPrice(),
      extras: selectedExtras,
      size: selectedSize.name,
      quantity,
      sizeId: selectedSize.id,
      };
      dispatch(addItem(product));
      setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <PickSize
              itemPrice={item.basePrice}
              sizes={item.sizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>
          <div className="space-y-4 text-center">
            <Label htmlFor="add-extras">Any extras?</Label>
            <Extras
              extras={item.extras}
              selectedExtras={selectedExtras}
              setSelectedExtras={setSelectedExtras}
            />
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <h3 className="text-lg ">Quantity:</h3>
          <div className="flex space-x-6">
            <Button
              type="button"
              className={`w-fit cursor-pointer ${
                quantity === 1 ? "opacity-0" : ""
              }`}
              onClick={() => setQuantity(quantity - 1)}
            >
              -
            </Button>
            <Button
              variant={"outline"}
              type="button"
              className="w-fit hover:bg-transparent hover:not-[]:"
            >
              {quantity}
            </Button>
            <Button
              type="button"
              className="w-fit cursor-pointer"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full h-10" onClick={onAddToCart}>
            Add to cart {formatCurrency(totalPrice())}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddToCartModel;

function PickSize({
  sizes,
  itemPrice,
  selectedSize,
  setSelectedSize,
}: {
  sizes: Size[];
  itemPrice: number;
  selectedSize: Size;
  setSelectedSize: (size: Size) => void;
}) {
  const onChangeSize = (size: Size) => {
    setSelectedSize(size);
  };
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
            checked={selectedSize.id === size.id}
            onClick={() => onChangeSize(size)}
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
function Extras({
  extras,
  selectedExtras,
  setSelectedExtras,
}: {
  extras: Extra[];
  selectedExtras: Extra[];
  setSelectedExtras: (extras: Extra[]) => void;
}) {
  const onChangeExtras = (extra: Extra) => {
    if (selectedExtras.includes(extra)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };
  return (
    <div className="">
      {extras.map((extra) => (
        <div
          key={extra.id}
          className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
        >
          <Checkbox
            className="text-primary border-primary"
            id={extra.id}
            checked={selectedExtras.includes(extra)}
            onClick={() => onChangeExtras(extra)}
          />
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
