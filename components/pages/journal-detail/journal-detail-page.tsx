"use client";

import { useFetchJournalDetail } from "@/app/lib/hooks/fetch-journals";
import { envVar } from "@/config/env-var";
import Image from "next/image";
import { useParams } from "next/navigation";
import Journal from "../home/journal";
import { GlassSkeleton } from "@/components/glass-skeleton";
import MarkdownRenderer from "@/components/markdown-renderer";
import { FetchJournalsResponse } from "@/app/lib/api/journals";

function JournalDetailPage({
  initialData,
  prefetchedJournals,
}: {
  initialData?: FetchJournalsResponse;
  prefetchedJournals?: FetchJournalsResponse;
}) {
  const params = useParams();
  const { data, isError, isLoading } = useFetchJournalDetail(
    params.slug as string,
    initialData,
  );

  if (isLoading || !data)
    return (
      <div className="space-y-12 lg:flex lg:gap-x-4.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <GlassSkeleton
            key={index}
            variant="card"
            // Tambahkan shrink-0 dan lg:w-xl di sini agar tidak menyusut (collapse)
            className="w-full lg:w-xl shrink-0 h-66 lg:h-105 aspect-auto overflow-hidden rounded-[10px] lg:rounded-[16px]"
          />
        ))}
      </div>
    );
  if (isError) return <div>Error</div>;

  const journal = data.data[0];
  return (
    <>
      <article className="pt-39">
        {/* Cover Image */}
        {/* <div className="relative overflow-hidden h-65.5 lg:h-185 aspect-video -translate-x-1/2 left-1/2">
          <Image
            src={`${envVar.API_URL}${journal.cover.url}`}
            alt={journal.cover.alternativeText}
            fill
            unoptimized
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div> */}

        {/* Content */}
        <section className="">
          {/* Date and reading time */}
          <div className="grid grid-cols-2 items-end lg:hidden">
            <div className="space-y">
              <h4 className="text-sm text-[#8C8C8C]">Date</h4>
              <p className="">
                {new Date(journal.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p>{journal.reading_time} read</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl lg:max-w-5xl font-minion mt-9 mb-9 lg:mb-0">
            {journal.title}
          </h1>

          <div className="hidden lg:block mt-9 space-y-1">
            <div className="flex items-center gap-x-2">
              <h4>By</h4>
              <p className="text-[#8C8C8C]">{journal.author.name}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <h4>Published</h4>
              <p className="text-[#8C8C8C]">
                {new Date(journal.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-x-2">
              <h4>Category</h4>
              <p className="text-[#8C8C8C]">{journal.category.name}</p>
            </div>
          </div>

          <div className="lg:mx-60 space-y-8">
            {journal.blocks.map((block, index) => {
              if (block.__component === "shared.rich-text" && block.body) {
                return (
                  <MarkdownRenderer
                    key={block.id || index}
                    content={block.body}
                    classNameP="leading-normal"
                  />
                );
              }
              if (block.__component === "shared.media" && block.file?.url) {
                return (
                  <div key={block.id || index} className="w-full">
                    <Image
                      src={`${envVar.API_URL}${block.file.url}`}
                      alt={block.file.alternativeText || "Journal media"}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-[10px] lg:rounded-[16px]"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </section>
      </article>

      <section
        aria-label="the latest journal"
        className="mt-23 lg:mt-48 pt-5 border-t border-[#909090]"
      >
        <Journal
          slug={journal.slug}
          title="The Latest"
          prefetchedJournals={prefetchedJournals}
        />
      </section>
    </>
  );
}

export default JournalDetailPage;
