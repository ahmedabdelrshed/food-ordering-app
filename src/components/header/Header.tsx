import Link from "../Link/Link";
import CartButton from "./CartButton";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="py-4 md:py-6">
      <div className="container flex items-center justify-between gap-6 lg:gap-10">
        <Link href={`/`} className="text-primary font-semibold text-2xl">
          🍕 Pizza
        </Link>
        <div className="flex items-center gap-4">
          <Navbar />
          <CartButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
