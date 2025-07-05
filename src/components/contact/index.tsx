import MainHeading from "@/components/main-heading";
import { Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";

const Contact = async() => {
    const lang = await getCurrentLang();
      const { home } = await getTrans(lang);
      const { contact } = home;
  return (
    <section className="section-gap" id={Routes.CONTACT}>
      <div className="container text-center">
        <MainHeading
          subTitle={contact["Don'tHesitate"]}
          title={contact.contactUs}
        />
        <div className="mt-8">
          <a className="text-4xl underline text-accent" href="tel:+2012121212">
            +201090281995
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
