import { Metadata } from "next";
import InquiryPage from "@/components/pages/form/chat-form";

export const metadata: Metadata = {
  title: "Start a Project | Widarto Impact",
  description: "Tell us about your brand project.",
};

export default function StartAProjectPage() {
  return (
    <div className="pt-38 pb-20">
      <InquiryPage theme="dark" />
    </div>
  );
}
