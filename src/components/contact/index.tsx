import MainHeading from "@/components/main-heading";
import { Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { PhoneCall } from "lucide-react";

const Contact = async () => {
  const lang = await getCurrentLang();
  const { home } = await getTrans(lang);
  const { contact } = home;

  return (
    <section
      className="section-gap py-4 relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white"
      id={Routes.CONTACT}
    >
      {/* Decorative background blob */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 w-60 h-60 bg-orange-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute right-0 bottom-0 w-72 h-72 bg-primary/10 rounded-full blur-2xl opacity-25" />
      </div>

      <div className="container flex flex-col items-center">
        <MainHeading
          subTitle={contact["Don'tHesitate"]}
          title={contact.contactUs}
        />

        <div className="mt-10 inline-block rounded-xl shadow-lg bg-white/80 backdrop-blur-md p-8 sm:p-12 border border-orange-100  flex-col items-center gap-6">
          <PhoneCall className="h-10 w-10 text-primary mb-2" />
          <p className="text-lg text-muted-foreground font-medium mb-2">
             We&apos;re just one call away!
          </p>
          <a
            className="text-3xl sm:text-4xl font-extrabold text-primary underline underline-offset-4 decoration-orange-400 hover:text-accent transition-colors duration-200 focus:ring-2 focus:ring-primary rounded-lg px-3 py-1"
            href="tel:+201090281995"
          >
            +201090281995
          </a>
          <a
            href="tel:+201090281995"
            className="bg-gradient-to-r from-primary to-orange-400 hover:to-orange-300 shadow-lg rounded-full text-lg text-white font-bold px-8 py-3 mt-4 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <PhoneCall className="h-5 w-5" />
             Call Us Now
          </a>
          <p className="text-sm text-gray-500 mt-4 max-w-xs">
             Available 9am–11pm every day
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
