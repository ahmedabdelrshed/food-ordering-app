import Image from "next/image";
import React from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import AddToCartModel from "./AddToCartModel";

const ProductCard = () => {
  return (
    <li
      className="p-6 rounded-lg text-center bg-[#f1f4f5]
       group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all"
    >
      <div className="relative w-48 h-48 mx-auto">
        <Image
          src={"/images/pizza.png"}
          className="object-cover"
          alt={"item.name"}
          fill
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-xl my-3">Pizza</h4>
        <strong className="text-accent">{formatCurrency(55.22)}</strong>
      </div>
      <p className="text-gray-500 text-sm line-clamp-3">Pizza description</p>
      <AddToCartModel
        item={{
          name: "Pizza",
          image: "/images/pizza.png",
          description: "Pizza description",
          price: '55.22',
        }}
      />
    </li>
  );
};

export default ProductCard;
