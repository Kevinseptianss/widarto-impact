"use client";

import React, { useState } from "react";
import { useFetchTeams } from "@/app/lib/hooks/fetch-teams";
import Accordion from "@/components/faq-accordion";

interface LeadershipProps {
  isLargeGrid?: boolean;
}

function Leadership({ isLargeGrid = true }: LeadershipProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const { data, isLoading, isError } = useFetchTeams();

  if (isLoading || !data) return <div>loading...</div>;
  if (isError) return <div>error</div>;

  const teams = data.data.main;

  return (
    <section aria-label="leadership" className="mt-18 lg:mt-48">
      <h2 className="text-4xl uppercase lg:text-5xl text-foreground whitespace-pre-wrap leading-12">
        Leadership
      </h2>

      {isLargeGrid ? (
        // LAYOUT DESKTOP: 2 Kolom Independen
        <div className="mt-6 lg:mt-9 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12 items-start">
          {/* SISI KIRI: Index Genap (0, 2, 4) */}
          <div className="flex flex-col w-full border-t border-[#909090]">
            {teams.map((team, index) => {
              if (index % 2 !== 0) return null; // Skip ganjil
              return (
                <Accordion
                  key={index}
                  title={team.name}
                  subtitle={team.position}
                  content={team.about}
                  isOpen={activeIndex === index}
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                />
              );
            })}
          </div>

          {/* SISI KANAN: Index Ganjil (1, 3, 5) */}
          <div className="flex flex-col w-full lg:border-t border-[#909090] mt-0">
            {teams.map((team, index) => {
              if (index % 2 === 0) return null; // Skip genap
              return (
                <Accordion
                  key={index}
                  title={team.name}
                  subtitle={team.position}
                  content={team.about}
                  isOpen={activeIndex === index}
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                />
              );
            })}
          </div>
        </div>
      ) : (
        // LAYOUT MOBILE: 1 Kolom (Biasa)
        <div className="mt-6 lg:mt-9 flex flex-col w-full border-t border-[#909090]">
          {teams.map((team, index) => (
            <Accordion
              key={index}
              title={team.name}
              subtitle={team.position}
              content={team.about}
              isOpen={activeIndex === index}
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Leadership;
