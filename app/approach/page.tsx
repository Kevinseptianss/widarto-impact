import About from "@/components/pages/information/about";
import ReplacingFAQInformation from "@/components/pages/information/replacing-faq-information";
import Leadership from "@/components/pages/information/leadership";
import BrandMarquee from "@/components/shared/brand-marquee";
import { Metadata } from "next";
import FAQInformation from "@/components/pages/information/faq-information";
import FAQ from "@/components/pages/home/faq";

export const metadata: Metadata = {
  title: "Information & About | Widarto Impact",
  description:
    "Learn more about Widarto Impact, our mission, and what drives our design agency forward.",
  openGraph: {
    title: "Information & About | Widarto Impact",
    description:
      "Learn more about Widarto Impact, our mission, and what drives our design agency forward.",
    type: "website",
  },
};

function Page() {
  return (
    <>
      <About />
      <FAQInformation />
      {/* <ReplacingFAQInformation /> */}
      <Leadership />
      <BrandMarquee />
      <FAQ />
    </>
  );
}

export default Page;
