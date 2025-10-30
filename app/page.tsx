// app/page.tsx
import Hero from "@/components/Hero";
import ValueBar from "@/components/ValueBar";
import ServicesGrid from "@/components/ServicesGrid";
import Process from "@/components/Process";
import AIDemo from "@/components/AIDemo";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Page() {
  return (
    <>
      <Hero />
      <ValueBar />
      <ServicesGrid />
      <Process />
    </>
  );
}
