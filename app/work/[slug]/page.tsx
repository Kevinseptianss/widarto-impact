import { Metadata } from "next";
import WorkDetail from "@/components/pages/work-detail/work-detail-page";
import { envVar } from "@/config/env-var";
import {
  getWorkDetailData,
  getWorksData,
  getWorksDataStaticParams,
} from "@/app/lib/api/works";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const worksList = await getWorksDataStaticParams();
    const works = worksList?.data?.works || [];
    console.log("works", works);
    console.log(
      "Generating static params for works:",
      works.map((w) => w.slug),
    );
    return works.map((work) => ({
      slug: work.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for work:", error);
    return [];
  }
}

async function getWork(slug: string) {
  try {
    const data = await getWorkDetailData(slug);
    return data?.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching work:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const work = await getWork(resolvedParams.slug);

  if (!work) {
    return {
      title: "Work Not Found | Widarto Impact",
    };
  }

  const title = `${work.title} | Widarto Impact`;
  const description =
    work.description || `Read about ${work.title} project by Widarto Impact.`;
  const imageUrl = work.thumbnail_image_desktop?.file?.url
    ? `${envVar.API_URL}${work.thumbnail_image_desktop.file.url}`
    : undefined;

  const url = `${envVar.SITE_URL}/work/${resolvedParams.slug}`;

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
      type: "website",
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

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const [initialData, worksListData] = await Promise.all([
    getWorkDetailData(resolvedParams.slug),
    getWorksData(resolvedParams.slug),
  ]);
  const work = initialData?.data?.[0] || null;

  let schema = null;
  if (work) {
    const imageUrl = work.thumbnail_image_desktop?.file?.url
      ? `${envVar.API_URL}${work.thumbnail_image_desktop.file.url}`
      : "";

    schema = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: work.title,
      description: work.description,
      image: imageUrl,
      author: {
        "@type": "Organization",
        name: "Widarto Impact",
      },
      datePublished: work.publishedAt,
      dateCreated: work.createdAt,
      dateModified: work.updatedAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${envVar.SITE_URL}/work/${resolvedParams.slug}`,
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
      <WorkDetail initialData={initialData} prefetchedWorks={worksListData} />
    </>
  );
}
