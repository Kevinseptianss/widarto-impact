import { Metadata } from "next";
import InquiryPage from "@/components/pages/form/chat-form";

export const metadata: Metadata = {
  title: "Start a Project | Widarto Impact",
  description: "Tell us about your brand project.",
};

export default function SheetFormPage() {
  return (
    <main className="pt-38 pb-20">
      <InquiryPage />
    </main>
  );
}
