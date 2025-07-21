"use client";

import { Button } from "@/components/ui/button";
import { Translations } from "@/types/translations";
import { Loader } from "lucide-react";

interface IProps {
  translations: Translations;
  pending: boolean;
  productId?: string;
}
const FormActions = ({ translations, pending, productId }: IProps) => {
  return (
    <div
      className={`${productId ? "grid grid-cols-2" : "flex flex-col"} gap-4`}
    >
      <Button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer mt-4"
      >
        {pending ? (
          <Loader />
        ) : productId ? (
          translations.save
        ) : (
          translations.create
        )}
      </Button>
      {productId ? (
        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer mt-4 "
        >
          {translations.delete}
        </Button>
      ) : (
        <Button
          type="button"
          className="w-full cursor-pointer mt-4"
          variant={"outline"}
        >
          {translations.cancel}
        </Button>
      )}
    </div>
  );
};

export default FormActions;
