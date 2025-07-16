import { Pages } from "@/lib/constants";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";

interface IProps {
    slug: string;
    translations: Translations;
}
const useFormFields = ({ slug, translations }: IProps) => {
    const loginFields = (): IFormField[] => [
        {
            label: translations.auth.login.email.label,
            name: "email",
            type: "text",
            placeholder: translations.auth.login.email.placeholder,
            autoFocus: true,
        },
        {
            label: translations.auth.login.password.label,
            name: "password",
            placeholder: translations.auth.login.password.placeholder,
            type: "password",
        },
    ]
    const getFormFields = ():IFormField[] => {
        switch (slug) {
            case Pages.LOGIN:
                return loginFields()
            default:
                return []
        }
    }
    return {
        getFormFields,
    }
}

export default useFormFields