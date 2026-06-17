"use client";

import { ArrowOut } from "../../../config/icons";
import { useRef } from "react";
import WorksCardSlider from "../../works-card-slider";
import Link from "next/link";
import { FetchWorkListResponse } from "@/app/lib/api/works";

function Hero({ prefetchedWorks }: { prefetchedWorks?: FetchWorkListResponse }) {
  const cardRefMobile = useRef<HTMLDivElement>(null);
  const cursorRefMobile = useRef<HTMLDivElement>(null);

  // const horizontalRef = useRef<HTMLDivElement>(null);
  // gsap.registerPlugin(ScrollTrigger);

  // useEffect(() => {
  //   const el = horizontalRef.current;
  //   if (!el) return;

  //   if (window.innerWidth < 1024) return; // only lg

  //   const totalWidth = el.scrollWidth;
  //   const viewportWidth = window.innerWidth - 36;

  //   const ctx = gsap.context(() => {
  //     gsap.to(el, {
  //       x: -(totalWidth - viewportWidth),
  //       ease: "none",
  //       scrollTrigger: {
  //         trigger: el,

  //         start: "center center",
  //         end: () => `+=${totalWidth}`,
  //         scrub: true,
  //         pin: true,
  //         anticipatePin: 1,
  //       },
  //     });
  //   });

  //   ScrollTrigger.refresh();

  //   return () => ctx.revert();
  // }, []);

  return (
    <section className="mt-38 grid">
      <div
        style={{
          scrollbarGutter: "stable",
          overscrollBehaviorX: "contain",
        }}
        className="lg:snap-x lg:snap-mandatory lg:scroll-smooth lg:overflow-x-scroll lg:no-scrollbar"
      >
        <WorksCardSlider prefetchedWorks={prefetchedWorks} />
      </div>

      <Link href="/work" aria-label="Works Page" className="block lg:hidden">
        <div
          ref={cardRefMobile}
          className="relative h-auto glass aspect-5/6 lg:aspect-3/2 bg-[#3C3C3C80] border border-[#3C3C3C4D] w-full lg:w-xl overflow-hidden rounded-[10px] lg:rounded-[16px] p-4"
        >
          <h2 className="text-4xl">Explore Our Work</h2>

          {/* Cursor follower */}
          <div
            ref={cursorRefMobile}
            className="pointer-events-none absolute top-0 left-0 opacity-0"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <ArrowOut width={36} height={36} />
          </div>

          <div className="absolute bottom-4 left-4">
            <ArrowOut width={24} height={24} />
          </div>
        </div>
      </Link>
    </section>
  );
}

export default Hero;
