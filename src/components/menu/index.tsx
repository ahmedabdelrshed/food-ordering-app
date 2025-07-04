import { TProductWithRelations } from "@/types/product";
import ProductCard from "./ProductCard";

const Menu = ({ products }: { products: TProductWithRelations[] }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {products.length ? (
        products.map((product) => (
          <ProductCard key={product.id} item={product} />
        ))
      ) : (
        <p className="text-accent text-center">No products found</p>
      )}
    </ul>
  );
};

export default Menu;
