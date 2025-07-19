import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import AddCategoryForm from "./_components/AddCategoryForm";
import { getCategories } from "@/server/db/categories";
import CategoryItem from "./_components/CategoryItem";

const CategoriesPage = async () => {
  const locale = await getCurrentLang();
  const categories = await getCategories();
  const translations = await getTrans(locale);

  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <div className="sm:max-w-[625px] mx-auto space-y-6">
            <AddCategoryForm translations={translations} />
            {categories.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </ul>
            ) : (
              <p className="text-accent text-center py-10">
                {translations.noCategoriesFound}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoriesPage;
