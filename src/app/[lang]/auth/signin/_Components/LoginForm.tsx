"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import useFormFields from "@/hooks/useFormFields";
import { Pages } from "@/lib/constants";
import { Translations } from "@/types/translations";

const LoginForm = ({ translations }: { translations: Translations }) => {
    const { getFormFields } = useFormFields({ slug: Pages.LOGIN, translations })
    console.log(getFormFields())
  return (
      <form className="space-y-4">
      {getFormFields().map((field) => (
          <FormFields {...field}  key={field.name}/>
      ))}
      <Button type="submit" className="w-full cursor-pointer">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
