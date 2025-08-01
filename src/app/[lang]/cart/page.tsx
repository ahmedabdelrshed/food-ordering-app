import { getServerSession } from "next-auth";
import CartItems from "./_components/CartItems";
import CheckoutForm from "./_components/CheckoutForm";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";

async function CartPage() {
  const initialSession = await getServerSession();
  const lang = await getCurrentLang()
  const translations = await getTrans(lang)
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <h1 className="text-primary text-center font-bold text-4xl italic mb-10">
            Cart
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <CartItems />
            <CheckoutForm initialSession={initialSession} translations={translations}/>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CartPage;
