import { Metadata } from "next";
import InquiryPage from "@/components/pages/form/chat-form";
import StartAProjectHeader from "@/components/startaproject-header";

export const metadata: Metadata = {
  title: "Start a Project | Widarto Impact",
  description: "Tell us about your brand project.",
};

export default function StartAProjectPage() {
  return (
    <>
      <StartAProjectHeader />

      <div className="pt-38 pb-20">
        <InquiryPage theme="dark" />
      </div>
    </>
  );
}
