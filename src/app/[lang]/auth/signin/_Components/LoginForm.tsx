"use client";
import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import useFormFields from "@/hooks/useFormFields";
import { Pages } from "@/lib/constants";
import { Translations } from "@/types/translations";
import { FormEvent, useRef, useState } from "react";
import { signIn } from "next-auth/react";

const LoginForm = ({ translations }: { translations: Translations }) => {
  const { getFormFields } = useFormFields({ slug: Pages.LOGIN, translations });
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState({});
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    try {
      const res = await signIn("credentials", { ...data, redirect: false });
      if (res?.error) {
        const validationError = JSON.parse(res?.error).validationError;
        setErrors(validationError);
        const responseError = JSON.parse(res?.error).responseError;
         console.log(responseError);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="space-y-4" onSubmit={onSubmit} ref={formRef}>
      {getFormFields().map((field) => (
        <FormFields {...field} key={field.name} error={errors} />
      ))}
      <Button type="submit" className="w-full cursor-pointer">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
