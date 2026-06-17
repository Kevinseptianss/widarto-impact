import WorkPage from "@/components/pages/work/work-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Widarto Impact",
  description:
    "Explore the portfolio of Widarto Impact. We help ambitious brands grow through strategic design and branding.",
  openGraph: {
    title: "Our Work | Widarto Impact",
    description:
      "Explore the portfolio of Widarto Impact. We help ambitious brands grow through strategic design and branding.",
    type: "website",
  },
};

function page() {
  return <WorkPage />;
}

export default page;
