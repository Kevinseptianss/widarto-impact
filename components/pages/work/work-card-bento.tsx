"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useFetchWorks } from "@/app/lib/hooks/fetch-works";
import { envVar } from "@/config/env-var";
import { GlassSkeleton } from "@/components/glass-skeleton";
import ReactPlayer from "react-player";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap"; // TAMBAHAN: Import GSAP
import { LazyVideoPlayer } from "@/components/shared/lazy-video-player";

type Props = {
  isTitleShow?: boolean;
  isCategoryShow?: boolean;
  imageWrapperClassName?: string;
};

function WorksCardBento({
  isTitleShow = true,
  isCategoryShow = true,
  imageWrapperClassName,
}: Props) {
  const { data, isLoading, error } = useFetchWorks();
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cardRefs = useRef<HTMLDivElement[]>([]);

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

  useEffect(() => {
    if (!data?.data?.works.length) return;

    const cards = cardRefs.current;
    const cleanups: (() => void)[] = [];

    cards.forEach((card) => {
      if (!card) return;

      // Targetkan elemen media di dalamnya saja
      const mediaInner = card.querySelector<HTMLDivElement>(".media-inner");
      if (!mediaInner) return;

      const onMouseEnter = () => {
        gsap.to(mediaInner, {
          scale: 1.05, // Skala membesar perlahan (bergerak ke dalam)
          duration: 0.6, // Durasi sedikit lebih lama agar terlihat mewah
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(mediaInner, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      };

      card.addEventListener("mouseenter", onMouseEnter);
      card.addEventListener("mouseleave", onMouseLeave);

      cleanups.push(() => {
        card.removeEventListener("mouseenter", onMouseEnter);
        card.removeEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [data]);

  // 1. Gabungkan kondisi loading dan isMounted agar tidak ada layar kosong putih (blank flash)
  if (!isMounted || isLoading || !data)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4.5 md:gap-y-4.5 lg:gap-y-6 w-full">
        {/* Kita buat 4 item placeholder agar bentuk bento (kiri-kanan-bawah full) terlihat jelas saat loading */}
        {Array.from({ length: 4 }).map((_, index) => {
          // Logika bento: setiap item ke-3 akan full width
          const isFullWidth = (index + 1) % 3 === 0;

          return (
            <div
              key={index}
              className={cn(
                "w-full flex flex-col",
                isFullWidth ? "md:col-span-2" : "",
              )}
            >
              {/* Skeleton Media (Gambar/Video) - Samakan aspect ratio-nya! */}
              <GlassSkeleton
                variant="card"
                className={cn(
                  "w-full overflow-hidden rounded-[10px] lg:rounded-[16px]",
                  isFullWidth
                    ? "aspect-[5/6] lg:aspect-[16/9]"
                    : "aspect-[5/6] lg:aspect-[3/2]",
                )}
              />

              {/* Skeleton Teks Judul */}
              {isTitleShow && (
                <GlassSkeleton className="w-2/3 h-8 mt-4 rounded-md" />
              )}

              {/* Skeleton Tags */}
              {isCategoryShow && (
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <GlassSkeleton className="w-16 h-[30px] rounded-[8px]" />
                  <GlassSkeleton className="w-20 h-[30px] rounded-[8px]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4.5 md:gap-y-4.5 lg:gap-y-6 w-full">
      {data?.data.works.map((item, index) => {
        const isFullWidth = (index + 1) % 3 === 0;

        // 1. Tangani Dynamic Zone yang mereturn Array
        const desktopThumb = Array.isArray(item.thumbnail_desktop)
          ? item.thumbnail_desktop[0]
          : item.thumbnail_desktop;

        const mobileThumb = Array.isArray(item.thumbnail_mobile)
          ? item.thumbnail_mobile[0]
          : item.thumbnail_mobile;

        // --- LOGIKA DESKTOP ---
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

        // --- LOGIKA MOBILE ---
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

        console.log("mobileVideoSrc", mobileVideoSrc);
        return (
          <div
            key={item.documentId || index}
            // TAMBAHAN: Pasang ref di sini agar GSAP bisa menangkap elemen card-nya
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
            className={cn(
              "w-full group cursor-pointer",
              imageWrapperClassName,
              isFullWidth ? "md:col-span-2" : "",
            )}
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
          >
            <Link
              href={`/work/${item.slug}`}
              aria-label={item.title}
              className="block w-full"
            >
              <div className="tilt-inner w-full flex flex-col">
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-muted/20 rounded-[10px] lg:rounded-[16px]",
                    isFullWidth
                      ? "aspect-5/6 lg:aspect-16/9 "
                      : "aspect-5/6 lg:aspect-3/2",
                  )}
                >
                  {/* TAMBAHAN: div media-inner untuk membungkus image/video agar bisa di-zoom */}
                  <div className="media-inner relative w-full h-full overflow-hidden rounded-[10px] lg:rounded-[16px] isolate">
                    {isMobile ? (
                      // --- RENDER MOBILE ---
                      isMobileVideo && mobileVideoSrc ? (
                        <LazyVideoPlayer
                          videoSrc={mobileVideoSrc}
                          title={item.title || "Mobile Video"}
                          priority={index === 0} // LCP aman di urutan pertama
                          sizes={isFullWidth ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
                          className="rounded-[10px] lg:rounded-[16px]"
                        />
                      ) : validMobileImgSrc ? (
                        <Image
                          src={validMobileImgSrc}
                          alt={
                            mobileThumb?.file?.alternativeText ||
                            "Mobile Thumbnail"
                          }
                          fill
                          priority={index === 0 || index === 1}
                          sizes={isFullWidth ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
                          className="object-cover rounded-[10px] lg:rounded-[16px]"
                        />
                      ) : null
                    ) : // --- RENDER DESKTOP ---
                    isDesktopVideo && desktopVideoSrc ? (
                      <LazyVideoPlayer
                        videoSrc={desktopVideoSrc}
                        title={item.title || "Desktop Video"}
                        priority={index === 0} // LCP aman di urutan pertama
                        sizes={isFullWidth ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
                        className="rounded-[10px] lg:rounded-[16px]"
                      />
                    ) : validDesktopImgSrc ? (
                      <Image
                        src={validDesktopImgSrc}
                        alt={
                          desktopThumb?.file?.alternativeText ||
                          "Desktop Thumbnail"
                        }
                        fill
                        priority={index === 0 || index === 1}
                        sizes={isFullWidth ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
                        className="object-cover rounded-[10px] lg:rounded-[16px]"
                      />
                    ) : null}
                  </div>
                </div>

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
    </div>
  );
}

export default WorksCardBento;
