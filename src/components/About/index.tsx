import { Routes } from "@/lib/constants";
import MainHeading from "../main-heading";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { Sparkles, Heart, ChefHat } from "lucide-react"; // or use your favorite icon

async function About() {
  const lang = await getCurrentLang();
  const { home } = await getTrans(lang);
  const { about } = home;
  return (
    <section
      className="section-gap py-5 relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white"
      id={Routes.ABOUT}
    >
      {/* Decorative abstract shape */}
      <div className="absolute left-0 -top-32 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="container text-center flex flex-col items-center">
        <MainHeading subTitle={about.ourStory} title={about.aboutUs} />

        {/* Decorative Icon */}
        <div className="flex justify-center mt-6 mb-4">
          <span className="bg-white rounded-full shadow-lg p-4 border border-orange-100 inline-flex">
            <ChefHat
              className="h-10 w-10 text-primary drop-shadow"
              strokeWidth={1.5}
            />
          </span>
        </div>

        {/* Story Cards/Paragraphs */}
        <div className="text-accent max-w-xl mx-auto mt-4 flex flex-col gap-6">
          <StoryParagraph>{about.descriptions.one}</StoryParagraph>
          <StoryParagraph>{about.descriptions.two}</StoryParagraph>
          <StoryParagraph>{about.descriptions.three}</StoryParagraph>
        </div>

        {/* Optional: Brand tagline/food promise */}
        <div className="mt-10">
          <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full text-primary font-semibold text-sm shadow-sm">
            <Sparkles className="h-4 w-4" />
            
              Fresh, Fast & Full of Flavor — Every Single Time.
            <Heart className="h-4 w-4 text-red-400" />
          </span>
        </div>
      </div>
    </section>
  );
}

// Subcomponent for beautiful paragraphs (with highlight icon if desired)
function StoryParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="relative bg-white/70 border-l-4 border-primary/20 px-6 py-4 rounded-xl text-base text-gray-700 shadow transition hover:shadow-lg hover:bg-orange-50 group text-start">
      <span
        className="absolute -left-4 top-2 text-primary/60 opacity-70 group-hover:opacity-100"
        aria-hidden
      >
        <ChefHat className="h-5 w-5" />
      </span>
      {children}
    </p>
  );
}

export default About;
