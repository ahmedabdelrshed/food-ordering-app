"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import useFormFields from "@/hooks/useFormFields";
import { Pages } from "@/lib/constants";
import { signUp } from "@/server/_actions/authActions";
import { Translations } from "@/types/translations";
import { ValidationErrors } from "@/validations/auth";
import { useActionState } from "react";
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
  const { getFormFields } = useFormFields({
    slug: Pages.Register,
    translations,
  });
    const [state,action] = useActionState(signUp,initialState);
  return (
    <form className="space-y-4" action={action}>
      {getFormFields().map((field) => (
        <FormFields {...field} key={field.name} error={{}}/>
      ))}
      <Button type="submit" className="w-full cursor-pointer">
        {translations.auth.register.submit}
      </Button>
    </form>
  );
};

export default RegisterForm;
