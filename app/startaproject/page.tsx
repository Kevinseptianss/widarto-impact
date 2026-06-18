import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InquiryPage from "@/components/pages/form/chat-form";

export const metadata: Metadata = {
  title: "Start a Project | Widarto Impact",
  description: "Tell us about your brand project.",
};

export default function StartAProjectPage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center py-5 px-4 bg-[#101010]/90 backdrop-blur-xl">
        <Link href="/" aria-label="Widarto Impact home">
          <Image
            src="/logo/widarto-impact-logo.svg"
            alt="Widarto Impact"
            width={240}
            height={74}
            priority
            draggable={false}
            className="h-auto w-[200px] lg:w-[240px]"
          />
        </Link>
      </header>

      <div className="pt-24 pb-20">
        <InquiryPage theme="dark" />
      </div>
    </>
  );
}
