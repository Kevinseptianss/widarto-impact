import { envVar } from "@/config/env-var";
import { RichTextBlock } from "@/components/pages/work-detail/about-project-content";

export type Media = {
  id: number;
  documentId: string;
  alternativeText: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  formats: {
    thumbnail: Format;
    small: Format;
    medium: Format;
    large: Format;
  };
};

export type Format = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
};

export type ProjectTeam = {
  id: number;
  name: string;
  url_link: string;
};

export type Works = {
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  client: string;
  project_team: string;
  industry: string;
  services: string;
  slug: string;
  about_the_project: RichTextBlock[];
  tags: string[];
  work_created_at: string;
  main_content: {
    __component:
      | "shared.single-media"
      | "shared.grid-media"
      | "shared.quote"
      | "shared.video-url-link";
    id: string;
    file: Media;
    files: Media[];
    direction: string;
    content: string;
    video_url: string;
  }[];
  thumbnail_image_desktop: {
    __component: "shared.media" | "shared.video-url-link";
    file: Media;
    video_url_link: string;
  };
  thumbnail_image_mobile: {
    __component: "shared.media" | "shared.video-url-link";
    file: Media;
    video_url_link: string;
  };
  project_teams: ProjectTeam[];

  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type WorkList = {
  id: 65;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  client: string;
  project_team: string;
  industry: string;
  services: string;
  about_the_project: string;
  slug: string;
  tags: string[];
  work_created_at: string;
  thumbnail_desktop: {
    __component: "shared.media" | "shared.video-url-link";
    file: Media;
    video_url: string;
  }[];
  thumbnail_mobile: {
    __component: "shared.media" | "shared.video-url-link";
    file: Media;
    video_url: string;
  }[];
};

export type FetchWorkListResponse = {
  data: {
    works: WorkList[];
  };
};

export type FetchWorkDetailResponse = {
  data: Works[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type FetchGalleryContactResponse = {
  data: {
    main: {
      __component: "shared.single-media" | "shared.video-url-link";
      id: number;
      file: Media;
      video_url: string;
    }[];
  };
};

const EMPTY_WORKS_DATA: FetchWorkListResponse = {
  data: {
    works: [],
  },
};

export const getWorksData = async (
  slug?: string,
): Promise<FetchWorkListResponse> => {
  if (!envVar.API_URL) {
    return EMPTY_WORKS_DATA;
  }

  const response = await fetch(
    `${envVar.API_URL}/api/works-list?populate[works][filters][slug][$ne]=${slug}&populate[works][populate][thumbnail_desktop][populate]=*&populate[works][populate][thumbnail_mobile][populate]=*`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envVar.API_TOKEN}`,
      },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch works");
  return response.json();
};

export const getWorksDataStaticParams = async (
  slug?: string,
  isRelatedWorks: boolean = false, // Tambahkan flag untuk membedakan kebutuhan data
): Promise<FetchWorkListResponse> => {
  // Jika mencari detail: gunakan $eq (Equal)
  // Jika mencari related works: gunakan $ne (Not Equal)
  const operator = isRelatedWorks ? "$ne" : "$eq";
  const filterQuery = slug
    ? `&populate[works][filters][slug][${operator}]=${slug}`
    : "";

  const response = await fetch(
    `${envVar.API_URL}/api/works-list?populate[works][populate][thumbnail_desktop][populate]=*&populate[works][populate][thumbnail_mobile][populate]=*${filterQuery}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envVar.API_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch works: ${response.statusText}`);
  }

  const result = await response.json();

  // Proteksi log jika data yang dikembalikan kosong saat proses build
  if (slug && (!result?.data?.works || result.data.works.length === 0)) {
    console.warn(
      `[Warning] getWorksData menghasilkan works kosong untuk slug: ${slug} dengan mode related: ${isRelatedWorks}`,
    );
  }

  return result;
};

export const getWorkListOnContact = async (slug?: string) => {
  const response = await fetch(
    `${envVar.API_URL}/api/works-list-on-contact?populate[works][filters][slug][$ne]=${slug}&populate[works][populate][thumbnail_desktop][populate]=*&populate[works][populate][thumbnail_mobile][populate]=*`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envVar.API_TOKEN}`,
      },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch works");
  return response.json();
};

export const getWorkDetailData = async (
  slug: string,
): Promise<FetchWorkDetailResponse> => {
  const response = await fetch(
    `${envVar.API_URL}/api/works?filters[slug][$eq]=${slug}&populate[thumbnail_desktop][populate]=*&populate[main_content][populate]=*&populate[thumbnail_mobile][populate]=*&populate[project_teams][populate]=*`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envVar.API_TOKEN}`,
      },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch work detail");
  return response.json();
};

export const getGalleryContact =
  async (): Promise<FetchGalleryContactResponse> => {
    const response = await fetch(
      `${envVar.API_URL}/api/contact-photo-gallery?populate[main][populate]=*`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${envVar.API_TOKEN}`,
        },
      },
    );
    if (!response.ok) throw new Error("Failed to fetch gallery contact");
    return response.json();
  };
