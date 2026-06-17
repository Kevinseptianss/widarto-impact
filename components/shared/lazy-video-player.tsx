"use client";

import React from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type LazyVideoPlayerProps = {
  videoSrc: string;
  title?: string;
  priority?: boolean; // True HANYA untuk video pertama (LCP)
  fetchPriority?: "high" | "low" | "auto";
  className?: string; // Untuk custom border-radius atau lainnya
  sizes?: string;
};

export function LazyVideoPlayer({
  videoSrc,
  title = "Video Content",
  priority = false,
  fetchPriority = "auto",
  className,
  sizes,
}: LazyVideoPlayerProps) {
  // Setup Intersection Observer
  const { ref, inView } = useInView({
    triggerOnce: true, // Hanya trigger satu kali (jangan unmount lagi saat di-scroll ke atas)
    rootMargin: "400px 0px", // Mulai render video 400px SEBELUM masuk ke layar (agar tidak delay)
  });

  return (
    // ref dimasukkan ke kontainer luar untuk dipantau oleh observer
    <div ref={ref} className="relative w-full h-full">
      {/* 1. LAYER BAWAH: Selalu Render Gambar untuk LCP & Placeholder */}

      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/images/video-placeholder.webp"
          alt={title}
          fill
          // PERHATIKAN:  sudah DIBUANG agar ukuran gambar jadi kecil!
          priority={priority}
          fetchPriority={fetchPriority}
          sizes={sizes}
          className={cn("object-cover", className)}
        />
      </div>

      {/* 2. LAYER ATAS: Render ReactPlayer HANYA jika sudah dekat/masuk ke layar */}
      {inView && videoSrc && (
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
          <ReactPlayer
            src={videoSrc}
            title={title}
            playing
            controls={false}
            loop
            muted
            autoPlay
            playsInline
            width="100%"
            height="100%"
            className={cn("object-cover overflow-hidden", className)}
            config={
              {
                file: {
                  attributes: {
                    playsInline: true,
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    } as React.CSSProperties,
                  },
                },
              } as any
            }
          />
        </div>
      )}
    </div>
  );
}
