"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import {
  useFetchPhotoGalleryContact,
  useFetchWorkListOnContact,
  useFetchWorks,
} from "@/app/lib/hooks/fetch-works";
import { envVar } from "@/config/env-var";
import { GlassSkeleton } from "./glass-skeleton";
import ReactPlayer from "react-player";
import { ArrowOut } from "@/config/icons";
import { LazyVideoPlayer } from "./shared/lazy-video-player";

type Props = {
  isTitleShow?: boolean;
  isCategoryShow?: boolean;
  imageWrapperClassName?: string;
  slug?: string;
};

function WorksCardSliderInContact({
  isTitleShow = true,
  isCategoryShow = true,
  imageWrapperClassName,
  slug,
}: Props) {
  // --- Refs ---
  const sliderRef = useRef<HTMLDivElement>(null); // TAMBAHAN: Ref untuk container slider
  const cardRefDesktop = useRef<HTMLDivElement>(null);
  const cursorRefDesktop = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const { data, isLoading, error } = useFetchPhotoGalleryContact();

  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  console.log("data", data);

  useEffect(() => {
    // Menggunakan setTimeout untuk menghindari cascading render
    const initTimer = setTimeout(() => {
      setIsMounted(true);
      setIsMobile(window.innerWidth < 1024);
    }, 0);

    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // --- EFFECT: Konversi Vertical Scroll ke Horizontal Scroll ---
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

  // --- Effect untuk Animasi Kursor ---

  if (!isMounted || isLoading || !data)
    return (
      <div className="lg:flex w-full overflow-hidden gap-x-4.5 pb-4 space-y-12 lg:space-y-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="snap-start shrink-0 w-full lg:w-xl flex flex-col"
          >
            <GlassSkeleton
              variant="card"
              className="w-full aspect-[3/2] overflow-hidden rounded-[10px] lg:rounded-[16px]"
            />
            {isTitleShow && (
              <GlassSkeleton className="w-3/4 h-8 mt-4 rounded-md" />
            )}
            {isCategoryShow && (
              <div className="flex gap-2 mt-2">
                <GlassSkeleton className="w-16 h-8 rounded-[8px]" />
                <GlassSkeleton className="w-20 h-8 rounded-[8px]" />
              </div>
            )}
          </div>
        ))}
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  return (
    // TAMBAHAN: Kita ubah Fragment <> menjadi div container dengan flex dan overflow-x-auto
    <div
      ref={sliderRef}
      className={cn(
        "lg:flex w-full overflow-x-auto gap-x-4.5 pb-4 space-y-12 lg:space-y-0",
        // Class ajaib untuk menghilangkan scrollbar di semua browser (Chrome, Safari, Firefox, Edge)
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
      )}
      style={{ scrollBehavior: "auto" }}
    >
      {data?.data.main.map((item, index) => {
        // Logika langsung menggunakan item dari API tanpa cek mobile/desktop
        const isUrlLink = item.__component === "shared.video-url-link";
        const isSingleMedia = item.__component === "shared.single-media";
        
        const isMediaVideo = isSingleMedia && item.file?.mime?.includes("video");
        const isVideo = isUrlLink || isMediaVideo;

        const videoSrc = isUrlLink
          ? item.video_url
          : isMediaVideo && item.file?.url
            ? `${envVar.API_URL}${item.file.url}`
            : "";

        const isImage = isSingleMedia && item.file?.mime?.includes("image");
        const imgSrc = isImage && item.file?.url ? `${envVar.API_URL}${item.file.url}` : "";
        const altText = item.file?.alternativeText || "Works Media";

        return (
          <div
            key={item.id || index}
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
            className={cn(
              "snap-start shrink-0 lg:w-xl group",
              imageWrapperClassName,
            )}
          >
            <div className="tilt-inner w-full flex flex-col">
              {/* Container Media */}
              <div className="relative w-full aspect-3/2 overflow-hidden bg-muted/20 rounded-[10px] lg:rounded-[16px]">
                <div className="media-inner w-full h-full origin-center transform-gpu will-change-transform">
                  {isVideo && videoSrc ? (
                    <LazyVideoPlayer
                      videoSrc={videoSrc}
                      title={altText}
                      priority={index === 0} // LCP aman di urutan pertama
                      sizes="(max-width: 1024px) 100vw, 576px"
                      className="rounded-[10px] lg:rounded-[16px]"
                    />
                  ) : isImage && imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={altText}
                      fill
                      priority={index === 0 || index === 1}
                      sizes="(max-width: 1024px) 100vw, 576px"
                      className="object-cover rounded-[10px] lg:rounded-[16px]"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WorksCardSliderInContact;
