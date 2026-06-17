import FAQ from "@/components/pages/home/faq";
import Hero from "@/components/pages/home/hero";
import Journal from "@/components/pages/home/journal";
import Program from "@/components/pages/home/program";
import { Metadata } from "next";
import { getFAQData } from "./lib/api/faq";
import { getWorksData } from "./lib/api/works";
import { generateFAQSchema } from "./lib/schema";
import Script from "next/script";
import TitleHome from "@/components/pages/home/title-home";
import BrandMarquee from "@/components/shared/brand-marquee";

export const metadata: Metadata = {
  title: "Widarto Impact | Branding & Design Agency",
  description:
    "Widarto Impact is a brand and design agency that creates meaningful impact for businesses through strategic design.",
  openGraph: {
    title: "Widarto Impact | Branding & Design Agency",
    description:
      "Widarto Impact is a brand and design agency that creates meaningful impact for businesses through strategic design.",
    type: "website",
    url: "https://widartoimpact.com",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Widarto Impact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Widarto Impact | Branding & Design Agency",
    description:
      "Widarto Impact is a brand and design agency that creates meaningful impact for businesses through strategic design.",
  },
};

export default async function Home() {
  const data = await getFAQData();
  const worksData = await getWorksData();
  const faqData = data?.data.main;

  const schema = generateFAQSchema(faqData);

  return (
    <>
      <link
        rel="preload"
        href="/images/video-placeholder.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TitleHome />
      <Hero prefetchedWorks={worksData} />
      <BrandMarquee />
      <Program />
      <section aria-label="journal" className="mt-24 lg:mt-48">
        <Journal title="Journal" />
      </section>
      <FAQ />
    </>
  );
}
