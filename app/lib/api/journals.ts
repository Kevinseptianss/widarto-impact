import { envVar } from "@/config/env-var";
import { Format, Media } from "./works";

export type Article = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  redirect_link: string;
  reading_time: string;
  slug: string;
  date_published: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string;
    caption: string;
    focalPoint: string;
    width: number;
    height: number;
    formats: Format;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    provider_metadata: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  author: {
    id: number;
    documentId: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  category: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  blocks: {
    __component: string;
    id: number;
    body?: string;
    file?: Media;
  }[];
};

export type FetchJournalsResponse = {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export const getJournalsData = async (
  slug?: string,
): Promise<FetchJournalsResponse> => {
  const response = await fetch(
    `${envVar.API_URL}/api/articles?sort[0]=createdAt:desc&populate[cover][populate]=*&populate[author][populate]=*&populate[category][populate]=*&populate[blocks][populate]=*${slug ? `&filters[slug][$ne]=${slug}` : ""}`,

    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envVar.API_TOKEN}`,
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch journals");
  return response.json();
};

export const getJournalsDataGenerateParams = async (
  slug?: string,
): Promise<FetchJournalsResponse> => {
  // Ganti $ne menjadi $eq untuk menyamakan slug
  const slugFilter = slug ? `&filters[slug][$eq]=${slug}` : "";

  const response = await fetch(
    `${envVar.API_URL}/api/articles?populate[cover][populate]=*&populate[author][populate]=*&populate[category][populate]=*&populate[blocks][populate]=*${slugFilter}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envVar.API_TOKEN}`,
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch journals: ${response.statusText}`);
  }

  const result = await response.json();

  // Proteksi dasar: jika format response Strapi tidak sesuai atau kosong
  if (!result || !result.data) {
    console.warn(
      `[Warning] Fetch journals menghasilkan data kosong untuk slug: ${slug}`,
    );
  }

  return result;
};

export const getJournalDetailData = async (
  slug: string,
): Promise<FetchJournalsResponse> => {
  const response = await fetch(
    `${envVar.API_URL}/api/articles?populate[cover][populate]=*&populate[author][populate]=*&populate[category][populate]=*&populate[blocks][populate]=*&filters[slug][$eq]=${slug}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envVar.API_TOKEN}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch journal detail");
  return response.json();
};
