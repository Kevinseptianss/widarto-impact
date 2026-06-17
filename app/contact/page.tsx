import Address from "@/components/pages/contact/address";
import FAQ from "@/components/pages/home/faq";
import Trenggalek from "@/components/pages/information/trenggalek";
import WorksCardSliderInContact from "@/components/works-card-slider-in-contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Widarto Impact",
  description:
    "Get in touch with Widarto Impact to start your branding and design journey.",
  openGraph: {
    title: "Contact Us | Widarto Impact",
    description:
      "Get in touch with Widarto Impact to start your branding and design journey.",
    type: "website",
  },
};

function Page() {
  return (
    <>
      <Address />
      <section className="py-10 mt-18 lg:mt-15 snap-x snap-mandatory scroll-smooth overflow-x-scroll no-scrollbar flex gap-x-4.5 perspective-1000">
        <WorksCardSliderInContact isTitleShow={false} isCategoryShow={false} />
      </section>
      <Trenggalek />
      <FAQ className="mt-23 lg:mt-48" />
    </>
  );
}

export default Page;
