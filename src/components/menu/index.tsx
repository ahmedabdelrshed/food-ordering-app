import ProductCard from "./ProductCard";

const Menu = () => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </ul>
  );
}

export default Menu