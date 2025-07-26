"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClientSession } from "@/hooks/useClientSession";
import { getTotalAmount } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatCurrency";
import { selectCartItems } from "@/store/features/cart/cartSlice";
import { useAppSelector } from "@/store/hooks";
import { loadStripe } from "@stripe/stripe-js";
import { Session } from "next-auth";

 loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);


function CheckoutForm({
  initialSession,
}: {
  initialSession: Session | null;
}) {
  const cart = useAppSelector(selectCartItems);
  const totalAmount = getTotalAmount(cart);
  const session = useClientSession(initialSession);
  const handleClick = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, user: session.data?.user }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };
  return (
    cart &&
    cart.length > 0 && (
      <div className="grid gap-6 bg-gray-100 rounded-md p-4">
        <h2 className="text-2xl text-black font-semibold">Checkout</h2>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="phone" className="text-accent">
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="Enter your phone"
                type="text"
                name="phone"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="address" className="text-accent">
                Street address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter your address"
                name="address"
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label htmlFor="postal-code" className="text-accent">
                  Postal code
                </Label>
                <Input
                  type="text"
                  id="postal-code"
                  placeholder="Enter postal code"
                  name="postal-code"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="city" className="text-accent">
                  City
                </Label>
                <Input
                  type="text"
                  id="city"
                  placeholder="Enter your City"
                  name="city"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="country" className="text-accent">
                  Country
                </Label>
                <Input
                  type="text"
                  id="country"
                  placeholder="Enter your country"
                  name="country"
                />
              </div>
            </div>
            <Button type="button" onClick={handleClick} className="h-10">
              Pay {formatCurrency(totalAmount)}
            </Button>
          </div>
        </form>
      </div>
    )
  );
}

export default CheckoutForm;
