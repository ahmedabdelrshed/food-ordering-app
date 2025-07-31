import MainHeading from "@/components/main-heading";
import ProductCard from "@/components/menu/ProductCard";
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
          <MainHeading
            subTitle={bestSeller.checkOut}
            title={bestSeller.OurBestSellers}
          />
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.length ? (
            products.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))
          ) : (
            <p className="text-accent text-center">No products found</p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default BestSeller;
