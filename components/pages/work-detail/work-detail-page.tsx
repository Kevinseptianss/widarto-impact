"use client";

import { useFetchWorkDetail } from "@/app/lib/hooks/fetch-works";
import { useParams } from "next/navigation";
import AboutProjectDrawer from "./about-project-drawer";
import Title from "./title";
import Image from "next/image";
import { envVar } from "@/config/env-var";
import MoreWork from "./more-work";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import AboutProjectContent from "./about-project-content";
import { GlassSkeleton } from "@/components/glass-skeleton";
import Link from "next/link";
import { FetchWorkDetailResponse, FetchWorkListResponse, ProjectTeam } from "@/app/lib/api/works";
import { LazyVideoPlayer } from "@/components/shared/lazy-video-player";

export default function WorkDetail({
  initialData,
  prefetchedWorks,
}: {
  initialData?: FetchWorkDetailResponse;
  prefetchedWorks?: FetchWorkListResponse;
}) {
  const params = useParams();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { data, isLoading, error } = useFetchWorkDetail(params.slug as string, initialData);

  const rightContentRef = useRef<HTMLDivElement | null>(null);
  const [stickyTop, setStickyTop] = useState("96px"); // Default jarak setara top-24

  useEffect(() => {
    const calculateSticky = () => {
      if (!rightContentRef.current) return;

      const elementHeight = rightContentRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Logika Sticky Bottom:
      // Jika konten kanan lebih panjang/tinggi dari layar
      if (elementHeight > viewportHeight - 100) {
        // Biarkan di-scroll natural. Saat bagian bawahnya menyentuh 40px dari dasar layar, dia akan "nyangkut"
        setStickyTop(`calc(100vh - ${elementHeight}px - 40px)`);
      } else {
        // Jika konten lebih pendek dari layar, langsung sticky di atas
        setStickyTop("96px");
      }
    };

    calculateSticky();

    // Kalkulasi ulang jika layar di-resize
    window.addEventListener("resize", calculateSticky);

    // ResizeObserver mendeteksi jika tinggi konten berubah (misal teks memanjang)
    const observer = new ResizeObserver(calculateSticky);
    if (rightContentRef.current) {
      observer.observe(rightContentRef.current);
    }

    return () => {
      window.removeEventListener("resize", calculateSticky);
      observer.disconnect();
    };
  }, [data, isAboutOpen]);

  if (isLoading || !data)
    return (
      <div className="w-full mt-9 md:mt-46 px-4 md:px-0">
        {/* Skeleton untuk Komponen Title */}
        <div className="space-y-4 mb-16">
          <GlassSkeleton className="w-3/4 md:w-1/2 h-12 md:h-20 rounded-lg" />
          <GlassSkeleton className="w-full md:w-1/3 h-6 rounded-md" />
        </div>

        {/* Skeleton untuk Layout Grid Kiri (Media) dan Kanan (Teks Sticky) */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4.5">
          {/* Kolom Kiri: Tumpukan Media */}
          <div className="space-y-4.5">
            <GlassSkeleton className="w-full aspect-video rounded-[10px] lg:rounded-[16px]" />
            <GlassSkeleton className="w-full aspect-video rounded-[10px] lg:rounded-[16px]" />
          </div>

          {/* Kolom Kanan: Teks About (Sembunyi di mobile saat loading) */}
          <div className="hidden md:block">
            <GlassSkeleton className="w-full h-[500px] rounded-[16px]" />
          </div>
        </div>
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  const work = data?.data?.[0];

  if (!work) {
    return (
      <div className="w-full flex justify-center items-center min-h-[50vh]">
        <h2 className="text-xl text-muted-foreground">Project not found.</h2>
      </div>
    );
  }

  return (
    <>
      <Title
        title={work.title}
        description={work.description}
        className="hidden md:block md:mt-46"
      ></Title>

      <div className="sticky hidden md:block top-24 z-50 pointer-events-none md:-mt-12">
        <AboutProjectDrawer
          isOpen={isAboutOpen}
          onOpenChange={setIsAboutOpen}
          className="pointer-events-auto items-end"
          content={work.about_the_project || []}
          projectClient={work.client || ""}
          projectTeam={work.project_teams || []}
          industry={work.industry || ""}
          services={work.services || ""}
        />
      </div>

      {/* STICKY ABOUT BUTTON WRAPPER - DESKTOP ONLY */}
      <div className="sticky block md:hidden top-20 z-100 pointer-events-none mt-20 md:mt-0">
        <AboutProjectDrawer
          isOpen={isAboutOpen}
          onOpenChange={setIsAboutOpen}
          className="pointer-events-auto md:items-end"
          content={work.about_the_project || []}
          projectClient={work.client || ""}
          projectTeam={work.project_teams || []}
          industry={work.industry || ""}
          services={work.services || ""}
        />
      </div>

      <Title
        title={work.title}
        description={work.description}
        className="block md:hidden mt-9"
      ></Title>

      {/* Wrapper */}
      <div
        className={cn(
          // PERUBAHAN 1: Tambahkan 'relative' di sini
          "relative grid grid-cols-1 mt-9 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:mt-20",
          "will-change-[grid-template-columns,gap]",
          isAboutOpen
            ? "md:grid-cols-2 md:gap-x-4.5"
            : "md:grid-cols-1 md:gap-x-0",
        )}
      >
        {/* Content sebelah kiri */}
        <div>
          <div className="space-y-4.5">
            {work.main_content?.map((block, index) => {
              if (block.__component === "shared.quote") {
                return (
                  <div key={`quote-${index}`}>
                    <h2
                      className={cn(
                        "text-2xl font-minion lg:text-4xl md:max-w-1/2 py-11",
                        isAboutOpen ? "md:max-w-none" : "md:max-w-1/2",
                        block.direction === "right"
                          ? "md:ml-auto"
                          : "md:mr-auto",
                      )}
                    >
                      {block.content}
                    </h2>
                  </div>
                );
              }

              if (block.__component === "shared.single-media") {
                const file = block.file;
                if (!file) return null;

                const isVideo = file.mime?.includes("video");
                // Siapkan Fallback Image untuk Video
                const videoCover = file.url
                  ? `${envVar.API_URL}${file.url}`
                  : "/images/video-placeholder.webp"; // Ganti dengan path lokal Anda

                return (
                  <div
                    key={`single-${index}`}
                    className="relative w-full overflow-hidden rounded-[10px] lg:rounded-[16px] aspect-video isolate"
                  >
                    {isVideo ? (
                      <LazyVideoPlayer
                        videoSrc={`${envVar.API_URL}${file.url}`}
                        title={work.title || "Single Video"}
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 80vw"
                        className="rounded-[10px] lg:rounded-[16px]"
                      />
                    ) : (
                      <Image
                        src={`${envVar.API_URL}${file.url}`}
                        alt={file.alternativeText || "Single Media"}
                        fill
                        // HAPUS  di sini!
                        priority={index === 0} // Sesuaikan logika priority
                        className="object-cover rounded-[10px] lg:rounded-[16px]"
                        draggable={false}
                        sizes="(max-width: 1024px) 100vw, 80vw"
                      />
                    )}
                  </div>
                );
              }

              if (block.__component === "shared.grid-media") {
                const files = block.files;
                if (!files || files.length === 0) return null;

                return (
                  <div
                    className={cn(
                      "grid",
                      isAboutOpen
                        ? "md:grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-4.5"
                        : "md:grid-cols-2 lg:grid-cols-2 gap-4.5",
                    )}
                    key={`grid-${index}`}
                  >
                    {files.map((file, i) => {
                      const isVideo = file.mime?.includes("video");
                      return (
                        <div
                          key={i}
                          className={cn(
                            "relative w-full aspect-8/9 overflow-hidden rounded-[10px] lg:rounded-[16px] isolate",
                          )}
                        >
                          {isVideo ? (
                            <LazyVideoPlayer
                              videoSrc={`${envVar.API_URL}${file.url}`}
                              title={work.title || "Grid Video"}
                              priority={i === 0 || i === 1} // LCP aman di urutan pertama
                              sizes="(max-width: 1024px) 100vw, 40vw"
                              className="rounded-[10px] lg:rounded-[16px]"
                            />
                          ) : (
                            <Image
                              src={`${envVar.API_URL}${file.url}`}
                              alt={file.alternativeText || "Grid Media"}
                              fill
                              priority={i === 0 || i === 1}
                              className="object-cover rounded-[10px] lg:rounded-[16px]"
                              draggable={false}
                              sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }

              if (block.__component === "shared.video-url-link") {
                const finalUrl =
                  block.video_url.includes("vimeo") ||
                  block.video_url.includes("youtube")
                    ? `${block.video_url}?background=1`
                    : block.video_url;

                return (
                  <div
                    key={`video-${index}`}
                    className={cn(
                      "relative w-full overflow-hidden rounded-[10px] lg:rounded-[16px] aspect-video isolate",
                    )}
                  >
                    <LazyVideoPlayer
                      videoSrc={finalUrl}
                      title={work.title || "Video Url Link"}
                      priority={index === 0} // LCP aman di urutan pertama
                      sizes="(max-width: 1024px) 100vw, 80vw"
                      className="rounded-[10px] lg:rounded-[16px]"
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>

        {/* LINTASAN / TRACK KANAN */}
        <div
          className={cn(
            "hidden md:block h-full",
            // PERUBAHAN 2: Tarik elemen ini keluar dari antrean grid saat tertutup
            isAboutOpen
              ? "relative"
              : "absolute top-0 right-0 w-[calc(50%-1.125rem)] pointer-events-none",
          )}
        >
          {/* ELEMEN STICKY KANAN (Biarkan utuh, jangan diubah) */}
          <div
            ref={rightContentRef}
            className={cn(
              "sticky",
              "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "transform will-change-transform",
              isAboutOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8 pointer-events-none",
            )}
            style={{ top: stickyTop }}
          >
            <AboutProjectContent content={work.about_the_project || []} />

            <div className="mt-15.5 grid grid-cols-2 gap-y-4.5">
              <div className="space-y-4.5">
                <div>
                  <h4 className="text-[#8C8C8C]">Client</h4>
                  <p>{work.client}</p>
                </div>

                <div>
                  <h4 className="text-[#8C8C8C]">Industry</h4>
                  <p>{work.industry}</p>
                </div>
                <div>
                  <h4 className="text-[#8C8C8C]">Services</h4>
                  <p className="whitespace-pre-wrap">{work.services}</p>
                </div>
              </div>
              <div>
                <h4 className="text-[#8C8C8C]">Team</h4>
                <div className="whitespace-pre-wrap">
                  {work.project_teams.map((team, index) =>
                    team.url_link ? (
                      <Link
                        aria-label={team.name}
                        href={team.url_link || "#"}
                        key={index}
                        target="_blank"
                        className="hover:underline block"
                      >
                        {team.name}
                      </Link>
                    ) : (
                      <p key={index} className="block">
                        {team.name}
                      </p>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MoreWork slug={work.slug} prefetchedWorks={prefetchedWorks} />
    </>
  );
}
