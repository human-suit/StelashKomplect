import { BrandsStrip } from "@/components/home/brands-strip";
import { CategoryGrid } from "@/components/home/category-grid";
import { CityConfirmBanner } from "@/components/home/city-confirm-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import {
  HomeBottomSections,
  HomeMidSections,
} from "@/components/home/home-deferred-sections";
import { HeroSlider } from "@/components/home/hero-slider";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { Reveal } from "@/components/ui/reveal";
import { listBrands } from "@/lib/content/brands";
import { listHeroSlides } from "@/lib/content/hero-slides";
import { getFeaturedProductsFromContent } from "@/lib/content/products";
import { Suspense } from "react";

export default async function HomePage() {
  const [slides, brands, featured] = await Promise.all([
    listHeroSlides(),
    listBrands(),
    getFeaturedProductsFromContent(),
  ]);

  return (
    <>
      <HeroSlider slides={slides} />
      <CityConfirmBanner />
      <Reveal>
        <BrandsStrip brands={brands} />
      </Reveal>
      <Reveal delay={40}>
        <CategoryGrid />
      </Reveal>
      <Reveal delay={60}>
        <FeaturedProducts products={featured} />
      </Reveal>
      <Suspense fallback={<SectionSkeleton minHeight={320} />}>
        <HomeMidSections />
      </Suspense>
      <Suspense fallback={<SectionSkeleton minHeight={320} />}>
        <HomeBottomSections />
      </Suspense>
    </>
  );
}
