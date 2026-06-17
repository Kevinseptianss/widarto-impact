"use client";
import { useFetchProgram } from "@/app/lib/hooks/fetch-programs";
import BrandAccordion from "../../brand-refresh-accordion";

function Program() {
  const { data, isLoading, isError } = useFetchProgram();

  if (isLoading || !data) return <div>loading...</div>;
  if (isError) return <div>error</div>;

  const programs = data?.data.main;
  return (
    <section id="program" aria-label="program" className="mt-18 lg:mt-48">
      <div>
        <p className="text-xl">PROGRAM</p>
        <h2 className="text-4xl font-minion mt-5.5 lg:max-w-[1020px]">
          Every brand reaches a moment that forces a decision. <br /> A new
          launch. A loss of edge. Growth that starts to stretch the system. A
          perception that no longer matches the ambition. <br /> <br />
          We work through five focused programs, each shaped around a specific
          stage in a brand’s commercial life. Find the one that matches where
          your brand is now.
        </h2>
      </div>

      <BrandAccordion programs={programs} />
    </section>
  );
}

export default Program;
