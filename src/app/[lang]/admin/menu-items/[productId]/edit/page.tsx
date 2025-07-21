import { getProductById, getProducts } from "@/server/db/products";
import ProductForm from "../../_components/ProductForm";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { getCategories } from "@/server/db/categories";
import { TProductWithRelations } from "@/types/product";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({ productId: product.id }));
}

const EditProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;
  const locale = await getCurrentLang();
  const translations = await getTrans(locale);
  const categories = await getCategories();
  const product = await getProductById(productId);
  return (
    <main>
      <section>
        <div className="container">
          <ProductForm
            categories={categories}
            translations={translations}
            product={product as TProductWithRelations}
          />
        </div>
      </section>
    </main>
  );
};

export default EditProductPage;
