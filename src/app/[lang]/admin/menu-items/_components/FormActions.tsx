"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { Translations } from "@/types/translations";
import { useEffect, useState } from "react";
import { deleteProduct } from "../_actions/product";
import toast from "react-hot-toast";
import {  useParams, useRouter } from "next/navigation";
import { Pages, Routes } from "@/lib/constants";

interface IProps {
  translations: Translations;
  pending: boolean;
  productId?: string;
}
const FormActions = ({ translations, pending, productId }: IProps) => {
  const [state, setState] = useState<{
    pending: boolean;
    status: null | number;
    message: string;
  }>({
    pending: false,
    status: null,
    message: "",
  });
  const { lang } = useParams();
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      setState((prev) => {
        return { ...prev, pending: true };
      });
      const res = await deleteProduct(id);
      setState((prev) => {
        return { ...prev, status: res.status, message: res.message };
      });
      router.push(`/${lang}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev) => {
        return { ...prev, pending: false };
      });
    }
  };
  useEffect(() => {
    if (state.status === 200) {
      toast.success(`${state.message}`);
    }

    if (state.status === 500) {
      toast.error(`${state.message}`);
    }
  }, [state.message, state.status]);

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
          onClick={() => handleDelete(productId)}
        >
          {state.pending ? <Loader /> : translations.delete}
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
