"use client";
import useFormFields from "@/hooks/useFormFields";
import { InputTypes, Routes } from "@/lib/constants";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import Image from "next/image";
import FormFields from "../form-fields/form-fields";
import { Button } from "../ui/button";
import { useActionState, useEffect, useState } from "react";
import { CameraIcon } from "lucide-react";
import { ValidationErrors } from "@/validations/auth";
import { updateProfile } from "@/app/[lang]/profile/_actions/profile";
import Loader from "../ui/Loader";
import toast from "react-hot-toast";

const UserForm = ({
  translations,
  user,
}: {
  translations: Translations;
  user: Session["user"];
}) => {
  const [selectedImage, setSelectedImage] = useState(user.image ?? "");
  const { getFormFields } = useFormFields({
    slug: Routes.PROFILE,
    translations,
  });
  const formData = new FormData();
  Object.entries(user).forEach(([key, value]) => {
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
  const [state, action, pending] = useActionState(updateProfile, initialState);
  useEffect(() => {
    if (state.status === 200) {
      toast.success(`${state.message}`);
    }
    if (state.status === 401 || state.status === 500) {
      toast.error(`${state.message}`);
    }
  }, [state.status, state.message]);

  useEffect(() => {
    setSelectedImage(user.image as string);
  }, [user.image]);

  return (
    <form action={action} className="flex flex-col md:flex-row gap-10">
      <div className="group relative w-[200px] h-[200px] overflow-hidden rounded-full mx-auto">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt={user.name}
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        )}
        <div
          className={`${
            selectedImage
              ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
              : ""
          } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
        >
          <UploadImage setSelectedImage={setSelectedImage} />
        </div>
      </div>
      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          const fieldValue =
            state?.formData?.get(field.name) ?? formData.get(field.name);
          return (
            <div key={field.name} className="mb-3">
              <FormFields
                {...field}
                error={state.error}
                defaultValue={fieldValue as string}
                readOnly={field.type === InputTypes.EMAIL}
              />
            </div>
          );
        })}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Loader /> : translations.save}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;

const UploadImage = ({
  setSelectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
      />
      <label
        htmlFor="image-upload"
        className="border rounded-full w-[200px] h-[200px] element-center cursor-pointer"
      >
        <CameraIcon className="!w-8 !h-8 text-accent" />
      </label>
    </>
  );
};
