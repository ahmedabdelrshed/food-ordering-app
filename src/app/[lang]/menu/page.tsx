import Menu from "@/components/menu";
import { getProductsByCategory } from "@/server/db/products";

const MenuPage = async () => {
    const categories = await getProductsByCategory();
    
  return (
    <main>
      {categories.length > 0 ? (
        categories.map((category) => (
          <section key={category.id} className="section-gap">
            <div className="container text-center">
              <h1 className="text-primary font-bold text-4xl italic mb-6">
                {category.name}
              </h1>
              {category.products.length > 0 && (
                  <Menu products={category.products} />
              )}
            </div>
          </section>
        ))
      ) : (
        <p className="text-accent text-center py-20">
          No products found
        </p>
      )}
    </main>
  );
}

export default MenuPage