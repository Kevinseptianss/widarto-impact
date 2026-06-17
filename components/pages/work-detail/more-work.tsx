"use client";

import WorksCardSlider from "@/components/works-card-slider";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FetchWorkListResponse } from "@/app/lib/api/works";

type Props = {
  slug: string;
  prefetchedWorks?: FetchWorkListResponse;
};
export default function MoreWork({ slug, prefetchedWorks }: Props) {
  const cardRefDesktop = useRef<HTMLDivElement>(null);
  const cursorRefDesktop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardDesktop = cardRefDesktop.current;
    const cursorDesktop = cursorRefDesktop.current;

    if (!cardDesktop || !cursorDesktop) return;

    const moveCursor = (e: MouseEvent) => {
      const rect = cardDesktop.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(cursorDesktop, {
        x,
        y,
        duration: 0.2,
        ease: "power3.out",
      });
    };

    const showCursor = () => {
      gsap.to(cursorDesktop, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
      });
    };

    const hideCursor = () => {
      gsap.to(cursorDesktop, {
        opacity: 0,
        scale: 0.5,
        duration: 0.3,
      });
    };

    cardDesktop.addEventListener("mousemove", moveCursor);
    cardDesktop.addEventListener("mouseenter", showCursor);
    cardDesktop.addEventListener("mouseleave", hideCursor);

    return () => {
      cardDesktop.removeEventListener("mousemove", moveCursor);
      cardDesktop.removeEventListener("mouseenter", showCursor);
      cardDesktop.removeEventListener("mouseleave", hideCursor);
    };
  }, []);
  return (
    <section
      aria-label="More Work"
      className="pt-5 mt-39 lg:mt-48 border-t border-[#909090]"
    >
      <h2 className="text-4xl">More Work</h2>
      <div className="mt-10 space-y-12 lg:snap-x lg:snap-mandatory lg:scroll-smooth lg:overflow-x-scroll lg:no-scrollbar lg:space-y-0 lg:flex lg:gap-x-4.5">
        <WorksCardSlider slug={slug} prefetchedWorks={prefetchedWorks} />
      </div>
    </section>
  );
}
