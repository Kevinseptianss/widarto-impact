"use client";
import React, { useState } from "react";
import Accordion from "../../faq-accordion";
import { cn } from "@/lib/utils";
import { useFetchFAQ } from "@/app/lib/hooks/fetch-faq";

type Props = {
  className?: string;
};
function FAQ({ className }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data, isLoading, isError } = useFetchFAQ();

  if (isLoading || !data) return <div>loading...</div>;
  if (isError) return <div>error</div>;
  return (
    <section aria-label="faq" id="faq" className={cn("mt-27.5 lg:mt-48", className)}>
      <h2 className="text-4xl lg:text-6xl">FAQs</h2>
      <div className="mt-6 lg:mt-9">
        {data.data.main.map((faq, index) => (
          <Accordion
            key={index}
            title={faq.question}
            isOpen={index === activeIndex}
            onClick={() => setActiveIndex(index === activeIndex ? null : index)}
            maxWidthContent="max-w-4xl"
            content={faq.answer}
          />
        ))}
      </div>
    </section>
  );
}

export default FAQ;
