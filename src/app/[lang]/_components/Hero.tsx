import Link from "@/components/Link/Link";
import { buttonVariants } from "@/components/ui/button";
import { Languages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { ArrowRightCircle } from "lucide-react";
import Image from "next/image";

const Hero = async () => {
  const lang = await getCurrentLang();
  const { home } = await getTrans(lang);
  const { hero } = home;

  return (
    <section
      className="
        relative overflow-hidden
        min-h-[600px] flex items-center
        bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-100
      "
    >
      {/* Optionally a decorative blurred "pulse" or ring */}
      <div className="absolute -right-40 -top-32 w-[480px] h-[480px] bg-gradient-to-br from-pink-300/30 via-orange-200/40 to-yellow-100/10 rounded-full blur-3xl -z-1" />
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left: Content */}
        <div className="py-12 md:py-20 flex flex-col items-start md:items-start gap-6">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide mb-3 shadow-sm ring-1 ring-primary/10">
            {hero.slogan}
          </span>
          <h1 className="text-5xl font-extrabold text-gray-800 mb-3 leading-tight drop-shadow-sm tracking-tight">
            {hero.title}
          </h1>
          <p className="text-accent text-lg max-w-xl mb-6">
            {hero.description}
          </p>
          <div className="flex flex-wrap items-center gap-5 mt-2">
            <Link
              href={`/${Routes.MENU}`}
              className={`${buttonVariants({
                size: "lg",
              })} flex gap-2 items-center !px-6 !py-3 !rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-150`}
              style={{
                background: "linear-gradient(90deg, #FF8015 0%, #FFE259 100%)",
                color: "#fff",
              }}
            >
              <span>{hero.orderNow}</span>
              <ArrowRightCircle
                className={`!w-6 !h-6 ${
                  lang === Languages.ARABIC ? "rotate-180" : ""
                }`}
                strokeWidth={2.4}
              />
            </Link>
            <Link
              href={`/${Routes.ABOUT}`}
              className="flex gap-2 items-center text-gray-700 hover:text-primary duration-200 transition-colors font-semibold underline-offset-4 underline decoration-primary/40 hover:decoration-primary"
            >
              <span>{hero.learnMore}</span>
              <ArrowRightCircle
                className={`!w-5 !h-5 ${
                  lang === Languages.ARABIC ? "rotate-180" : ""
                }`}
              />
            </Link>
          </div>
          {/* Optional: food icons, ratings, etc. */}
          <div className="flex gap-6 mt-8 items-center">
            <span className="flex items-center gap-1 text-primary">
              <svg
                className="h-4 w-4 inline"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <circle cx={10} cy={10} r={10} fill="#fffbe8" />
                <polygon
                  points="10,3 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8"
                  fill="#FFB000"
                />
              </svg>
              <span className="font-medium text-sm">4.9/5 (2,300+)</span>
            </span>
            <span className="flex items-center gap-2 text-secondary">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="#FF6F3C"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21c7-4 10-8.5 10-13.5C22 3 17.5.5 12 5.5 6.5.5 2 3 2 7.5c0 5 3 9.5 10 13.5z"
                ></path>
              </svg>
              <span className="text-sm">Fast Delivery</span>
            </span>
          </div>
        </div>
        {/* Right: Image with ring/shine */}
        <div className="hidden md:flex items-center justify-center relative h-[370px]">
          <div className="absolute inset-0 rounded-full bg-orange-50 shadow-xl ring-8 ring-primary/20" />
          <Image
            src="/images/pizza.png"
            alt="Pizza"
            fill
            priority
            loading="eager"
            className="object-contain z-10 scale-110  drop-shadow-2xl"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
