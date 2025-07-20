"use client";

import FormFields from "@/components/form-fields/form-fields";
import useFormFields from "@/hooks/useFormFields";
import { Pages, Routes } from "@/lib/constants";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import ProductImage from "./ProductImage";
import { useState } from "react";

const ProductForm = ({ translations }: { translations: Translations }) => {
  const { getFormFields } = useFormFields({
    slug: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
    translations,
  });

  const [selectedImage, setSelectedImage] = useState<string>("");
  return (
    <form className="flex flex-col md:flex-row gap-10">
      <div>
        <ProductImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        {/* {state?.error?.image && (
          <p className="text-sm text-destructive text-center mt-4 font-medium">
            {state.error?.image}
          </p>
        )} */}
      </div>
      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          return (
            <div key={field.name} className="mb-3">
              <FormFields {...field} error={{}} />
            </div>
          );
        })}
      </div>
    </form>
  );
};

export default ProductForm;
