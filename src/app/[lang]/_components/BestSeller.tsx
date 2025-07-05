import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import { getProductsBestSellers } from "@/server/db/products";

const BestSeller = async () => {
    const products = await getProductsBestSellers();
  return (
    <section>
      <div className="container mb-10">
        <div className="text-center mb-10">
          <MainHeading subTitle={"checkOut"} title={"Our Best Sellers"} />
        </div>
        <Menu products={products}/>
      </div>
    </section>
  );
};

export default BestSeller;
