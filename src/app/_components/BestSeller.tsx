import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";

const BestSeller = () => {
  return (
    <section>
      <div className="container mb-10">
        <div className="text-center mb-10">
          <MainHeading subTitle={"checkOut"} title={"Our Best Sellers"} />
        </div>
        <Menu />
      </div>
    </section>
  );
};

export default BestSeller;
