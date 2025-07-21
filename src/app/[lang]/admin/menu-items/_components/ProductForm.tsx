"use client";

import FormFields from "@/components/form-fields/form-fields";
import useFormFields from "@/hooks/useFormFields";
import { Pages, Routes } from "@/lib/constants";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import ProductImage from "./ProductImage";
import { useActionState, useEffect, useState } from "react";
import {
  Category,
  Extra,
  ExtraIngredients,
  ProductSizes,
  Size,
} from "@prisma/client";
import SelectCategory from "./SelectCategory";
import ItemOptionGroup from "./ItemOptionGroup";
import { ValidationErrors } from "@/validations/auth";
import { addProduct } from "../_actions/product";
import toast from "react-hot-toast";
import { TProductWithRelations } from "@/types/product";
import FormActions from "./FormActions";

const ProductForm = ({
  translations,
  categories,
  product,
}: {
  translations: Translations;
  categories: Category[];
  product?: TProductWithRelations;
}) => {
  const { getFormFields } = useFormFields({
    slug: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
    translations,
  });
  const [selectedImage, setSelectedImage] = useState<string>(
    product?.image ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? categories[0].id
  );
  const [sizes, setSizes] = useState<Partial<Size>[]>(product?.sizes ?? []);
  const [extras, setExtras] = useState<Partial<Extra>[]>(product?.extras ?? []);
  const formData = new FormData();
  Object.entries(product ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== "image") {
      formData.append(key, value.toString());
    }
  });
  const initialState: {
    message?: string;
    error?: ValidationErrors;
    status?: number | null;
    formData?: FormData | null;
  } = {
    message: "",
    error: {},
    status: null,
    formData: null,
  };

  const [state, action, pending] = useActionState(
    addProduct.bind(null, { categoryId, options: { sizes, extras } }),
    initialState
  );
  useEffect(() => {
    if (state.status === 201) {
      toast.success(`${state.message}`);
      setSelectedImage("");
      setCategoryId(categories[0].id);
      setSizes([]);
      setExtras([]);
    }
    if (state.status === 500) {
      toast.error(`${state.message}`);
    }
  }, [state.message, state.status, categories]);

  return (
    <form action={action} className="flex flex-col md:flex-row gap-10">
      <div>
        <ProductImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        {state?.error?.image && (
          <p className="text-sm text-destructive text-center mt-4 font-medium">
            {state.error?.image}
          </p>
        )}
      </div>
      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          const fieldValue =
            state.formData?.get(field.name) ?? formData.get(field.name);
          return (
            <div key={field.name} className="mb-3">
              <FormFields
                {...field}
                error={state.error}
                defaultValue={fieldValue as string}
              />
            </div>
          );
        })}
        <SelectCategory
          categories={categories}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          translations={translations}
        />
        <ItemOptionGroup<Size>
          setState={setSizes}
          state={sizes}
          translations={translations}
          name={translations.sizes}
          optionsNames={Object.keys(ProductSizes)}
        />
        <ItemOptionGroup<Extra>
          setState={setExtras}
          state={extras}
          translations={translations}
          name={translations.extrasIngredients}
          optionsNames={Object.keys(ExtraIngredients)}
        />
        <FormActions  translations={translations} pending={pending} productId={product?.id}/>
      </div>
    </form>
  );
};

export default ProductForm;
