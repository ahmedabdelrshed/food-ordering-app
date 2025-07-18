"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import useFormFields from "@/hooks/useFormFields";
import { Pages, Routes } from "@/lib/constants";
import { signUp } from "@/server/_actions/authActions";
import { Translations } from "@/types/translations";
import { ValidationErrors } from "@/validations/auth";
import { useParams, useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
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
const RegisterForm = ({ translations }: { translations: Translations }) => {
  const { lang } = useParams();
  const router = useRouter();
  const { getFormFields } = useFormFields({
    slug: Pages.Register,
    translations,
  });
  const [state, action, pending] = useActionState(signUp, initialState);
  useEffect(() => {
    if (state.status === 201) {
      toast.success(`${state.message}`);
      router.replace(`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`);
    }
    if (state.status === 409) {
      toast.error(`${state.message}`);
    }
  }, [state.status, state.message, router, lang]);
  return (
    <form className="space-y-4" action={action}>
      {getFormFields().map((field) => {
        const fieldValue = state.formData?.get(field.name);
        return (
          <FormFields
            {...field}
            key={field.name}
            error={state.error}
            defaultValue={fieldValue as string}
          />
        );
      })}
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={pending}
      >
        {pending ? <Loader /> : translations.auth.register.submit}
      </Button>
    </form>
  );
};

export default RegisterForm;
