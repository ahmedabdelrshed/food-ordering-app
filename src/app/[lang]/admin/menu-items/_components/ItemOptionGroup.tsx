import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Translations } from "@/types/translations";
import { Extra, Size } from "@prisma/client";
import ItemOptions from "./ItemOptions";
export type OptionType = Size | Extra;
export type Props<T extends OptionType> = {
  state: Partial<T>[];
  setState: React.Dispatch<React.SetStateAction<Partial<T>[]>>;
  translations: Translations;
  optionsNames: string[];
  name: string;
};
const ItemOptionGroup = <T extends OptionType>({
  state,
  setState,
  translations,
  optionsNames,
  name,
}: Props<T>) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-gray-100 rounded-md px-4 w-80 mb-4 "
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">
          {name}
        </AccordionTrigger>
        <AccordionContent>
          <ItemOptions
            state={state}
            setState={setState}
            translations={translations}
            optionsNames={optionsNames}
            name={name}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ItemOptionGroup;
