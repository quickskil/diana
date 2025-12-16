import { Biography } from '@/components/Biography';
import { Hero } from '@/components/Hero';
import { Offerings } from '@/components/Offerings';
import { Testimonials } from '@/components/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Biography />
      <Offerings />
      <Testimonials />
    </>
  );
}
