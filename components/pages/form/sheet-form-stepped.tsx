import { Metadata } from "next";
import SheetFormStepped from "@/components/sheet-form-stepped";

export const metadata: Metadata = {
  title: "Start a Project | Widarto Impact",
  description: "Fill out the project inquiry form directly on the page.",
};

export default function SheetFormPage() {
  return (
    <main className="pt-38 pb-20">
      <div className="mx-auto max-w-6xl">
        <SheetFormStepped />
      </div>
    </main>
  );
}
