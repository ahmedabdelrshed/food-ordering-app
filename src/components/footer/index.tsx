import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";

const Footer = async () => {
    const lang = await getCurrentLang();
    const { copyRight } = await getTrans(lang);
  return (
    <footer className="border-t p-8 text-center text-accent  w-full">
      <div className="container">
        <p>{copyRight}</p>
      </div>
    </footer>
  );
};

export default Footer;
