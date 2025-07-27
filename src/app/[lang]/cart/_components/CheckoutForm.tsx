"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { useClientSession } from "@/hooks/useClientSession";
import useFormFields from "@/hooks/useFormFields";
import { getTotalAmount } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatCurrency";
import { checkoutAction } from "@/server/_actions/checkoutAction";
import { selectCartItems } from "@/store/features/cart/cartSlice";
import { useAppSelector } from "@/store/hooks";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { ValidationErrors } from "@/validations/auth";
import { loadStripe } from "@stripe/stripe-js";
import { Session } from "next-auth";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({
  translations,
  initialSession,
}: {
  translations: Translations;
  initialSession: Session | null;
}) {
  const cart = useAppSelector(selectCartItems);
  const totalAmount = getTotalAmount(cart);
  const session = useClientSession(initialSession);
  const { getFormFields } = useFormFields({ slug: "checkout", translations });
  const initialState: {
    error?: ValidationErrors;
    status?: number | null;
    formData?: FormData | null;
    message?: string | null; 
  } = {
    error: {},
    status: null,
    formData: null,
    message: "", 
  };
  const [state, action, pending] = useActionState(
    checkoutAction.bind(null, { session: session.data!, items: cart }),
    initialState
  );
  useEffect(() => {
    if (state.status === 200) {
      window.location.href = state.message!;
    }
   if (state.status === 500) {
     toast.error(`${state.message}`);
   }
  },[state])
  return (
    cart &&
    cart.length > 0 && (
      <div className="grid gap-6 bg-gray-100 rounded-md p-4">
        <h2 className="text-2xl text-black font-semibold">Checkout</h2>
        <form action={action}>
          <div className="grid gap-4">
            {getFormFields().map((field: IFormField) => {
              const fieldValue = state?.formData?.get(field.name) ?? "";
              return (
                <div key={field.name} className="mb-3">
                  <FormFields
                    {...field}
                    error={state.error}
                    defaultValue={fieldValue as string}
                  />
                </div>
              );
            })}
            <Button type="submit"  className="h-10">
              {pending ? <Loader /> : ` Pay ${formatCurrency(totalAmount)}`}
            </Button>
          </div>
        </form>
      </div>
    )
  );
}

export default CheckoutForm;
