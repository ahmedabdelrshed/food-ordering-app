import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { getProductsBestSellers } from "@/server/db/products";

const BestSeller = async () => {
  const products = await getProductsBestSellers();
  const lang = await getCurrentLang();
  const { home } = await getTrans(lang);
  const { bestSeller } = home;
  return (
    <section>
      <div className="container mb-10">
        <div className="text-center mb-10">
          <MainHeading subTitle={bestSeller.checkOut} title={bestSeller.OurBestSellers} />
        </div>
        <Menu products={products}/>
      </div>
    </section>
  );
};

export default BestSeller;
