import TextField from "./text-field";
import PasswordField from "./password-field";
import { IFormField } from "@/types/app";
import { InputTypes } from "@/lib/constants";
import { ValidationErrors } from "@/validations/auth";

interface Props extends IFormField {
  error:ValidationErrors;
}

const FormFields = (props: Props) => {
  const { type } = props;
  const renderField = (): React.ReactNode => {
    if (type === InputTypes.EMAIL || type === InputTypes.TEXT) {
      return <TextField {...props} />;
    }

    if (type === InputTypes.PASSWORD) {
      return <PasswordField {...props} />;
    }

    return <TextField {...props} />;
  };

  return <>{renderField()}</>;
};

export default FormFields;
