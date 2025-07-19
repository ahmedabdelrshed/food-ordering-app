"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translations } from "@/types/translations";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useActionState, useEffect } from "react";
import Loader from "@/components/ui/Loader";
import { addCategory } from "../_actions/category";
import toast from "react-hot-toast";

type InitialStateType = {
  message?: string;
  error?: ValidationError;
  status?: number | null;
};
const initialState: InitialStateType = {
  message: "",
  error: {},
  status: null,
};
function AddCategoryForm({ translations }: { translations: Translations }) {
  const [state, action, pending] = useActionState(addCategory, initialState);

  useEffect(() => {
    if (state.status === 201) {
      toast.success(`${state.message}`);
    }
    if (state.status === 400 || state.status === 500) {
      toast.error(`${state.message}`);
    }
  }, [state.message, state.status]);

  return (
    <form action={action}>
      <div className="space-y-2">
        <Label htmlFor="name">
          {translations.admin.categories.form.name.label}
        </Label>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            name="name"
            id="name"
            placeholder={translations.admin.categories.form.name.placeholder}
          />
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader /> : translations.create}
          </Button>
        </div>
        {state.error?.name && (
          <p className="text-sm text-destructive">{state.error.name}</p>
        )}
      </div>
    </form>
  );
}

export default AddCategoryForm;
