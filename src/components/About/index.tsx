import { Routes } from "@/lib/constants";
import MainHeading from "../main-heading";

async function About() {
  return (
    <section className="section-gap" id={Routes.ABOUT}>
      <div className="container text-center">
        <MainHeading subTitle={"Our story"} title={"About us"} />
        <div className="text-accent max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
            Welcome to our pizzeria, where we serve the finest pizzas made with
            the freshest ingredients. Every slice is a masterpiece, crafted with
            care to deliver the perfect balance of flavors. From classic
            favorites to unique creations, there&apos;s something for every
            pizza lover!,
          </p>
          <p>
            Our passion for pizza shines through every dish. We hand-pick the
            best local ingredients and bake them to perfection, ensuring that
            every bite is delicious and satisfying. Whether you&apos;re here for
            a quick meal or a relaxed dining experience, we’ve got you covered.,
          </p>
          <p>
            Join us on a flavorful journey and experience the joy of pizza like
            never before. We pride ourselves on delivering great taste, quality,
            and service to make every meal memorable. Come and taste the
            difference!
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
