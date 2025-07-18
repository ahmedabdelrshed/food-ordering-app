import useFormFields from "@/hooks/useFormFields";
import { InputTypes, Routes } from "@/lib/constants";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import Image from "next/image";
import FormFields from "../form-fields/form-fields";
import { Button } from "../ui/button";

const UserForm = ({
  translations,
  user,
}: {
  translations: Translations;
  user: Session["user"];
}) => {
  const { getFormFields } = useFormFields({
    slug: Routes.PROFILE,
    translations,
  });
  return (
    <form className="flex flex-col md:flex-row gap-10">
      <div className="group relative w-[200px] h-[200px] overflow-hidden rounded-full mx-auto">
        <Image
          src={`https://res.cloudinary.com/du04klrm0/image/upload/v1750661549/med_VQA_Data/profile-pictures/681f4069fc3b031452d01bee.jpg`}
          alt={user.name}
          width={200}
          height={200}
          className="rounded-full object-cover"
        />

        {/* <div
          className={`${
            selectedImage
              ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
              : ""
          } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
        >
          <UploadImage setSelectedImage={setSelectedImage} />
        </div> */}
      </div>
      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          return (
            <div key={field.name} className="mb-3">
              <FormFields
                {...field}
                error={{}}
                readOnly={field.type === InputTypes.EMAIL}
              />
            </div>
          );
        })}
        {/* {session.data?.user.role === UserRole.ADMIN && (
          <div className="flex items-center gap-2 my-4">
            <Checkbox
              name="admin"
              checked={isAdmin}
              onClick={() => setIsAdmin(!isAdmin)}
              label="Admin"
            />
          </div>
        )} */}
        <Button type="submit" className="w-full">
          {translations.save}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
