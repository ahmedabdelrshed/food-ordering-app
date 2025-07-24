import Link from "@/components/Link/Link";
import Menu from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentLang } from "@/lib/getCurrentLang";
import { cn } from "@/lib/utils";
import { getCategories } from "@/server/db/categories";
import { getProductWithSearch } from "@/server/db/products";
import SearchInput from "./_components/SearchInput";

const MenuPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string;
    query?: string; }>;
}) => {
  const categoryName = (await searchParams).category ?? "";
  const query = (await searchParams).query ?? "";
  const categories = await getCategories();
  const products = await getProductWithSearch(categoryName, query);
  const lang = await getCurrentLang();
  return (
    <main className="mt-10">
      <SearchInput />
      <ul className="flex items-center flex-wrap gap-4 justify-center">
        <Link
          href={`/${lang}/menu`}
          className={cn(
            buttonVariants({
              variant: categoryName === "" ? "outline" : "default",
            }),
            "hover:!text-white"
          )}
        >
          All
        </Link>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/${lang}/menu?category=${category.name}`}
              className={cn(
                buttonVariants({
                  variant:
                    category.name === categoryName ? "outline" : "default",
                }),
                "hover:!text-white"
              )}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="container my-10">
        {products && products.length > 0 ? (
          <Menu products={products} />
        ) : (
          <p className="text-center text-accent">No products found</p>
        )}
      </div>
    </main>
  );
};

export default MenuPage;
