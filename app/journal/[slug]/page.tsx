import JournalDetailPage from "@/components/pages/journal-detail/journal-detail-page";
import React from "react";
import { Metadata } from "next";
import { envVar } from "@/config/env-var";
import {
  getJournalDetailData,
  getJournalsData,
  getJournalsDataGenerateParams,
} from "@/app/lib/api/journals";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const journalsList = await getJournalsDataGenerateParams();
    const journals = journalsList?.data || [];
    console.log("journals", journals);
    console.log(
      "Generating static params for journals:",
      journals.map((j) => j.slug),
    );
    return journals.map((journal) => ({
      slug: journal.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for journal:", error);
    return [];
  }
}

async function getJournal(slug: string) {
  try {
    const data = await getJournalDetailData(slug);
    return data?.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching journal:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const journal = await getJournal(resolvedParams.slug);

  if (!journal) {
    return {
      title: "Journal Not Found | Widarto Impact",
    };
  }

  const title = `${journal.title} | Widarto Impact`;
  const description =
    journal.description ||
    `Read about ${journal.title} on Widarto Impact Journal.`;
  const imageUrl = journal.cover?.url
    ? `${envVar.API_URL}${journal.cover.url}`
    : undefined;

  const url = `${envVar.SITE_URL}/journal/${resolvedParams.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Widarto Impact",
      type: "article",
      publishedTime: journal.publishedAt,
      modifiedTime: journal.updatedAt,
      authors: journal.author?.name ? [journal.author.name] : undefined,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

async function Page({ params }: Props) {
  const resolvedParams = await params;
  const [initialData, journalsListData] = await Promise.all([
    getJournalDetailData(resolvedParams.slug),
    getJournalsData(resolvedParams.slug),
  ]);
  const journal = initialData?.data?.[0] || null;

  let schema = null;
  if (journal) {
    const imageUrl = journal.cover?.url
      ? `${envVar.API_URL}${journal.cover.url}`
      : "";

    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: journal.title,
      description: journal.description,
      image: imageUrl ? [imageUrl] : [],
      datePublished: journal.publishedAt,
      dateModified: journal.updatedAt,
      author: {
        "@type":
          journal.author?.name === "Widarto Impact" ? "Organization" : "Person",
        name: journal.author?.name || "Widarto Impact",
      },
      publisher: {
        "@type": "Organization",
        name: "Widarto Impact",
        logo: {
          "@type": "ImageObject",
          url: `${envVar.SITE_URL}/logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${envVar.SITE_URL}/journal/${resolvedParams.slug}`,
      },
    };
  }

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <JournalDetailPage
        initialData={initialData}
        prefetchedJournals={journalsListData}
      />
    </>
  );
}

export default Page;
