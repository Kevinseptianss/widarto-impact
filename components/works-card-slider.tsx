"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { envVar } from "@/config/env-var";
import { GlassSkeleton } from "./glass-skeleton";
import { ArrowOut } from "@/config/icons";
import { LazyVideoPlayer } from "./shared/lazy-video-player";
import { useQuery } from "@tanstack/react-query";
import { FetchWorkListResponse, getWorksData } from "@/app/lib/api/works";

type Props = {
  isTitleShow?: boolean;
  isCategoryShow?: boolean;
  imageWrapperClassName?: string;
  slug?: string;
  prefetchedWorks?: FetchWorkListResponse;
};

function WorksCardSlider({
  isTitleShow = true,
  isCategoryShow = true,
  imageWrapperClassName,
  slug,
  prefetchedWorks,
}: Props) {
  // --- Refs ---
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRefDesktop = useRef<HTMLDivElement>(null);
  const cursorRefDesktop = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const { data, isLoading, error } = useQuery<FetchWorkListResponse>({
    queryKey: ["works", slug],
    queryFn: () => getWorksData(slug),
    initialData: prefetchedWorks,
    staleTime: 1000 * 60 * 5, // 5 menit
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => {
      clearTimeout(initTimer);
    };
  }, []);

  // --- Effect untuk Animasi Hover Premium ---
  useEffect(() => {
    if (!data?.data.works?.length) return;

    const cards = cardRefs.current;
    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        if (!card) return;

        const mediaInner = card.querySelector<HTMLDivElement>(".media-inner");
        if (!mediaInner) return;

        const onMouseEnter = () => {
          gsap.to(mediaInner, {
            scale: 1.1,
            duration: 0.6,
            ease: "power2.out",
          });
        };

        const onMouseLeave = () => {
          gsap.to(mediaInner, { scale: 1, duration: 0.8, ease: "power2.out" });
        };

        card.addEventListener("mouseenter", onMouseEnter);
        card.addEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => ctx.revert();
  }, [data]);

  // --- Effect untuk Animasi Kursor ---
  useEffect(() => {
    const cardDesktop = cardRefDesktop.current;
    const cursorDesktop = cursorRefDesktop.current;

    if (!cardDesktop || !cursorDesktop) return;

    // Gunakan quickTo untuk performa maksimal pada mousemove
    const xTo = gsap.quickTo(cursorDesktop, "x", {
      duration: 0.2,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursorDesktop, "y", {
      duration: 0.2,
      ease: "power3.out",
    });

    const moveCursor = (e: MouseEvent) => {
      const rect = cardDesktop.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      xTo(x);
      yTo(y);
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

  // Jika tidak ada data dan sedang loading (atau belum mount di client), tampilkan skeleton
  if (!data && (isLoading || !isMounted))
    return (
      <div className="lg:flex w-full overflow-hidden gap-x-4.5 pb-4 space-y-12 lg:space-y-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="snap-start shrink-0 w-full lg:w-xl flex flex-col"
          >
            <GlassSkeleton
              variant="card"
              className="w-full aspect-[5/6] lg:aspect-[3/2] overflow-hidden rounded-[10px] lg:rounded-[16px]"
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
    <div
      ref={sliderRef}
      className={cn(
        "lg:flex w-full overflow-x-auto gap-x-4.5 pb-4 space-y-12 lg:space-y-0",
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
      )}
      style={{ scrollBehavior: "auto" }}
    >
      {data?.data.works.slice(0, 5).map((item, index) => {
        const desktopThumb = Array.isArray(item.thumbnail_desktop)
          ? item.thumbnail_desktop[0]
          : item.thumbnail_desktop;

        const mobileThumb = Array.isArray(item.thumbnail_mobile)
          ? item.thumbnail_mobile[0]
          : item.thumbnail_mobile;

        // Logika Desktop
        const isDesktopUrlLink =
          desktopThumb?.__component === "shared.video-url-link";
        const isDesktopMediaVideo = desktopThumb?.file?.mime?.includes("video");
        const isDesktopVideo = isDesktopUrlLink || isDesktopMediaVideo;

        const desktopVideoSrc = isDesktopUrlLink
          ? desktopThumb?.video_url
          : `${envVar.API_URL}${desktopThumb?.file?.url}`;

        const desktopImgPath = desktopThumb?.file?.url;
        const validDesktopImgSrc = desktopImgPath
          ? `${envVar.API_URL}${desktopImgPath}`
          : "";

        // Logika Mobile
        const isMobileUrlLink =
          mobileThumb?.__component === "shared.video-url-link";
        const isMobileMediaVideo = mobileThumb?.file?.mime?.includes("video");
        const isMobileVideo = isMobileUrlLink || isMobileMediaVideo;

        const mobileVideoSrc = isMobileUrlLink
          ? mobileThumb?.video_url
          : `${envVar.API_URL}${mobileThumb?.file?.url}`;

        const mobileImgPath = mobileThumb?.file?.url;
        const validMobileImgSrc = mobileImgPath
          ? `${envVar.API_URL}${mobileImgPath}`
          : "";

        return (
          <div
            key={item.documentId || index}
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
            className={cn(
              "snap-start shrink-0 lg:w-xl group cursor-pointer",
              imageWrapperClassName,
            )}
          >
            <Link
              href={`/work/${item.slug}`}
              aria-label={item.title}
              className="block w-full"
            >
              <div className="tilt-inner w-full flex flex-col">
                {/* Container Media */}
                <div className="relative w-full h-auto aspect-[5/6] lg:aspect-[3/2] overflow-hidden bg-muted/20 rounded-[10px] lg:rounded-[16px]">
                  {/* TAMBAHAN: Kita berikan class 'relative' di media-inner agar layer tumpukan tidak keluar jalur */}
                  <div className="media-inner relative w-full h-full origin-center transform-gpu will-change-transform">
                    {/* Mobile Media - hidden on desktop via CSS */}
                    <div className="block lg:hidden w-full h-full">
                      {isMobileVideo && mobileVideoSrc ? (
                        <LazyVideoPlayer
                          videoSrc={mobileVideoSrc}
                          title={item.title || "Mobile Video"}
                          priority={index === 0}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          sizes="100vw"
                          className="rounded-[10px] lg:rounded-[16px]"
                        />
                      ) : validMobileImgSrc ? (
                        <Image
                          src={validMobileImgSrc}
                          alt={item.title || "Mobile Thumbnail"}
                          fill
                          priority={index === 0}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          sizes="100vw"
                          className="object-cover rounded-[10px] lg:rounded-[16px]"
                        />
                      ) : null}
                    </div>
                    {/* Desktop Media - hidden on mobile via CSS */}
                    <div className="hidden lg:block w-full h-full">
                      {isDesktopVideo && desktopVideoSrc ? (
                        <LazyVideoPlayer
                          videoSrc={desktopVideoSrc}
                          title={item.title || "Desktop Video"}
                          priority={index === 0}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          sizes="576px"
                          className="rounded-[10px] lg:rounded-[16px]"
                        />
                      ) : validDesktopImgSrc ? (
                        <Image
                          src={validDesktopImgSrc}
                          alt={item.title || "Desktop Thumbnail"}
                          fill
                          priority={index === 0 || index === 1}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          sizes="576px"
                          className="object-cover rounded-[10px] lg:rounded-[16px]"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Container Teks */}
                {isTitleShow && <h1 className="text-2xl mt-4">{item.title}</h1>}

                {isCategoryShow && item.tags && (
                  <div className="flex flex-wrap gap-2 items-center mt-2">
                    {item.tags.map((tag, i) => (
                      <div
                        key={i}
                        className="flex-center m-0 max-h-[30px] px-[12px] py-[8px] rounded-[8px] btn"
                      >
                        <span className="text-[13px]">{tag}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        );
      })}

      <Link href="/work" aria-label="Works Page">
        <div
          ref={cardRefDesktop}
          className="relative hidden glass lg:block aspect-[5/6] lg:aspect-[3/2] snap-start shrink-0 bg-[#3C3C3C80] border border-[#3C3C3C4D] lg:w-xl w-full overflow-hidden rounded-[10px] lg:rounded-[16px] p-4"
        >
          <h2 className="text-4xl">Explore Our Work</h2>
          <div
            ref={cursorRefDesktop}
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
    </div>
  );
}

export default WorksCardSlider;
