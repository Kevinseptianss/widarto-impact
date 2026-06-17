"use client";

import { useFetchInformationFAQ } from "@/app/lib/hooks/fetch-faq";
import AccordionInformationV2 from "./replacing-faq-information-v2";

function FAQInformation() {
  const { data, isLoading, isError } = useFetchInformationFAQ();

  if (isLoading || !data) return <div>loading...</div>;
  if (isError) return <div>error</div>;

  return (
    <section aria-label="faq-information" className="mt-18 lg:mt-48">
      <AccordionInformationV2 dataHowWeWork={data.data.main} />
    </section>
  );
}

export default FAQInformation;
