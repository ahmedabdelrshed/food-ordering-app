import { Category } from "@prisma/client";
import getTrans from "@/lib/translation";
import { getCurrentLang } from "@/lib/getCurrentLang";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";

async function CategoryItem({ category }: { category: Category }) {
  const locale = await getCurrentLang();
  const translations = await getTrans(locale);
  return (
    <li className="bg-gray-300 p-4 rounded-md flex justify-between">
      <h3 className="text-black font-medium text-lg flex-1">{category.name}</h3>
      <div className="flex items-center gap-2">
        <EditCategory translations={translations} category={category} />
        <DeleteCategory id={category.id} />
      </div>
    </li>
  );
}

export default CategoryItem;
