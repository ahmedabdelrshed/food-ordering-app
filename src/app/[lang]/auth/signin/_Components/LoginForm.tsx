"use client";
import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import useFormFields from "@/hooks/useFormFields";
import { Pages, Routes } from "@/lib/constants";
import { Translations } from "@/types/translations";
import { FormEvent, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const LoginForm = ({ translations }: { translations: Translations }) => {
  const { lang } = useParams();
  const router = useRouter();
  const { getFormFields } = useFormFields({ slug: Pages.LOGIN, translations });
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    try {
      const res = await signIn("credentials", { ...data, redirect: false });
      if (res?.error) {
        const validationError = JSON.parse(res?.error).validationError;
        setErrors(validationError);
        const responseError = JSON.parse(res?.error).responseError;
        if (responseError) {
          toast.error(`${responseError}`, {
            duration: 2500,
          });
        }
      }
      if (res?.ok) {
        toast.success(`${translations.messages.loginSuccessful}`, {});
        router.replace(`/${lang}/${Routes.PROFILE}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="space-y-4" onSubmit={onSubmit} ref={formRef}>
      {getFormFields().map((field) => (
        <FormFields {...field} key={field.name} error={errors} />
      ))}
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? <Loader /> : translations.auth.login.submit}
      </Button>
      <Button
        type="button"
        variant={"outline"}
        className="w-full cursor-pointer hover:bg-white hover:text-black"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Login with Google{" "}
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google Logo"
          width="20"
          height="20"
        />
      </Button>
    </form>
  );
};

export default LoginForm;
