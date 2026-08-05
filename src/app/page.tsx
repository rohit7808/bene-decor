import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import BestSelling from "@/components/home/BestSelling";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedCollections />
      <WhyChooseUs />
      <BestSelling />
    </>
  );
}




