import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import { db } from "@/lib/prisma";

const BestSeller = async () => {
    const products = await db.product.findMany({include:{sizes:true,extras:true}})
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
