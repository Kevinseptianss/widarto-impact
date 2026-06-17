"use client";

import { useFetchJournals } from "@/app/lib/hooks/fetch-journals";
import { GlassSkeleton } from "@/components/glass-skeleton";
import { envVar } from "@/config/env-var";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { FetchJournalsResponse } from "@/app/lib/api/journals";

function Journal({
  slug,
  title,
  prefetchedJournals,
}: {
  slug?: string;
  title?: string;
  prefetchedJournals?: FetchJournalsResponse;
}) {
  const { data, isLoading, isError } = useFetchJournals(slug, prefetchedJournals);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollPrev(scrollLeft > 5);
      setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      updateScrollButtons();
      slider.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        slider.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [data]);

  const scrollPrev = () => {
    if (sliderRef.current) {
      const firstCard = sliderRef.current.firstElementChild as HTMLElement;
      if (!firstCard) return;
      const cardWidth = firstCard.clientWidth;
      const gap = 18;
      const step = cardWidth + gap;

      const currentSnapPos =
        Math.round(sliderRef.current.scrollLeft / step) * step;
      const targetScroll = Math.max(0, currentSnapPos - step);

      sliderRef.current.style.scrollSnapType = "none";

      gsap.to(sliderRef.current, {
        scrollLeft: targetScroll,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          if (sliderRef.current) {
            sliderRef.current.style.scrollSnapType = "x mandatory";
          }
        },
      });
    }
  };

  const scrollNext = () => {
    if (sliderRef.current) {
      const firstCard = sliderRef.current.firstElementChild as HTMLElement;
      if (!firstCard) return;
      const cardWidth = firstCard.clientWidth;
      const gap = 18;
      const step = cardWidth + gap;

      const maxScroll =
        sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
      const currentSnapPos =
        Math.round(sliderRef.current.scrollLeft / step) * step;
      const targetScroll = Math.min(maxScroll, currentSnapPos + step);

      sliderRef.current.style.scrollSnapType = "none";

      gsap.to(sliderRef.current, {
        scrollLeft: targetScroll,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          if (sliderRef.current) {
            sliderRef.current.style.scrollSnapType = "x mandatory";
          }
        },
      });
    }
  };

  // useEffect(() => {
  //   const slider = sliderRef.current;
  //   if (!slider) return;

  //   const handleWheel = (e: WheelEvent) => {
  //     // Abaikan jika tidak ada pergerakan vertikal
  //     if (e.deltaY === 0) return;

  //     const isScrollingDown = e.deltaY > 0;
  //     const isScrollingUp = e.deltaY < 0;

  //     // Cek apakah ada sisa ruang untuk di-scroll ke kanan atau kiri
  //     // Menggunakan Math.ceil untuk menghindari bug pembulatan desimal di beberapa layar
  //     const canScrollRight =
  //       Math.ceil(slider.scrollLeft + slider.clientWidth) < slider.scrollWidth;
  //     const canScrollLeft = slider.scrollLeft > 0;

  //     // Jika kita nge-scroll ke bawah DAN masih bisa geser kanan,
  //     // ATAU nge-scroll ke atas DAN masih bisa geser kiri
  //     if (
  //       (isScrollingDown && canScrollRight) ||
  //       (isScrollingUp && canScrollLeft)
  //     ) {
  //       e.preventDefault(); // Cegah halaman web ikut turun/naik
  //       slider.scrollLeft += e.deltaY; // Ubah tenaga putaran atas-bawah jadi kiri-kanan
  //     }
  //   };

  //   // PENTING: passive harus false agar e.preventDefault() tidak diabaikan browser
  //   slider.addEventListener("wheel", handleWheel, { passive: false });

  //   return () => {
  //     slider.removeEventListener("wheel", handleWheel);
  //   };
  // }, [data]);

  if (isLoading || !data)
    return (
      <div className="mt-4.5">
        <div className="flex justify-between items-center mb-4.5 lg:mb-12">
          {title ? <h2 className="text-4xl">{title}</h2> : <div />}
          <div className="flex gap-x-2">
            <button
              disabled
              aria-label="Scroll Left"
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#909090] md:border-[#3C3C3C] flex items-center justify-center text-[#3C3C3C] cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              disabled
              aria-label="Scroll Right"
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#909090] md:border-[#3C3C3C] flex items-center justify-center text-[#3C3C3C] cursor-not-allowed"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        <div className="flex w-full overflow-hidden gap-x-4.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <GlassSkeleton
              key={index}
              variant="card"
              className={cn(
                "shrink-0 h-66 md:h-80 lg:h-105 overflow-hidden rounded-[10px] lg:rounded-[16px]",
                "w-[85vw] md:w-[calc((100%-2.5*1.125rem)/3.2)] lg:w-[calc((100%-3.5*1.125rem)/4.2)]",
              )}
            />
          ))}
        </div>
      </div>
    );
  if (isError) return <div>Error...</div>;
  return (
    <div className="mt-4.5">
      <div className="flex justify-between items-center mb-4.5 lg:mb-12">
        {title ? <h2 className="text-4xl">{title}</h2> : <div />}
        <div className="flex gap-x-2">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Scroll Left"
            className={cn(
              "w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#909090] md:border-[#3C3C3C] flex items-center justify-center transition-colors",
              canScrollPrev
                ? "bg-white text-black"
                : "text-white md:text-[#8C8C8C] cursor-not-allowed",
            )}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Scroll Right"
            className={cn(
              "w-10 h-10 lg:w-12 lg:h-12 rounded-full border flex items-center justify-center transition-colors",
              canScrollNext
                ? "bg-white text-black border-white"
                : "border-[#909090] md:border-[#3C3C3C] text-[#3C3C3C] cursor-not-allowed",
            )}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div
        ref={sliderRef}
        className={cn(
          "flex w-full overflow-x-auto gap-x-4.5 pb-4 space-y-12 lg:space-y-0 snap-x snap-mandatory no-scrollbar",
          // Class ajaib untuk menghilangkan scrollbar di semua browser (Chrome, Safari, Firefox, Edge)
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        )}
        style={{ scrollBehavior: "auto" }}
      >
        {data?.data.map((article, index) => {
          let isRedirectLink = false;
          if (article.redirect_link !== "" && article.redirect_link !== null) {
            isRedirectLink = true;
          }

          return (
            <Link
              key={index}
              aria-label={article.title}
              className={cn(
                "snap-start shrink-0",
                "w-[85vw] md:w-[calc((100%-2.5*1.125rem)/3.2)] lg:w-[calc((100%-3.5*1.125rem)/4.2)]",
              )}
              target={"_blank"}
              href={
                isRedirectLink
                  ? article.redirect_link
                  : `/journal/${article.slug}`
              }
            >
              <article className="w-full">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[10px] lg:rounded-[16px] aspect-[1.2/1]",
                  )}
                >
                  <Image
                    src={`${envVar.API_URL}${article.cover.url}`}
                    alt={article.cover.alternativeText}
                    fill
                    className="object-cover rounded-[10px] lg:rounded-[16px]"
                    draggable={false}
                    priority={index === 0 || index === 1}
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                </div>

                <p className="mt-4.5 text-[#8C8C8C]">{article.category.name}</p>
                <h3 className="font-minion text-2xl">{article.title}</h3>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Journal;
