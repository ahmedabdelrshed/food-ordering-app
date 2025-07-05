import Hero from "./_components/Hero";
import BestSeller from "./_components/BestSeller";
import About from "@/components/About";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <BestSeller />
      <About />
      <Contact />
    </main>
  );
}
