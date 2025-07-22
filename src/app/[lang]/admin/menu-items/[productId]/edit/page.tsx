import { getProductById } from "@/server/db/products";
import ProductForm from "../../_components/ProductForm";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { getCategories } from "@/server/db/categories";
import { TProductWithRelations } from "@/types/product";

// export async function generateStaticParams() {
//   const products = await getProducts();

//   return products.map((product) => ({ productId: product.id }));
// }
interface PageProps {
  params: Promise<{
    productId: string;
    lang: string;
  }>;
}

const EditProductPage = async ( {params} : PageProps) => {
  const { productId } = await params;
  console.log(productId)
  const locale = await getCurrentLang();
  const translations = await getTrans(locale);
  const categories = await getCategories();
  const product = await getProductById(productId);
console.log(product)
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
