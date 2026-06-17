import { envVar } from "@/config/env-var";

export type FAQ = {
  id: number;
  question: string;
  answer: string;
};

export type InformationFAQ = {
  id: number;
  title: string;
  subtitle: string;
  subtitle_highlight: string;
  content: string;
  is_how_we_work: boolean;
  how_we_work_main: {
    id: number;
    phase_number: string;
    phase_name: string;
    phase_description: string;
    is_badge_show: boolean;
  }[]
};

export type FetchFAQResponse = {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    main: FAQ[];
  };
};

export type FetchInformationFAQResponse = {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    main: InformationFAQ[];
  };
};

const DUMMY_FAQ_DATA: FetchFAQResponse = {
  data: {
    id: 1,
    documentId: "dummy-faq",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
    main: [
      {
        id: 1,
        question: "What services does Widarto Impact offer?",
        answer:
          "We provide brand strategy, visual identity, digital design, and creative direction for businesses that want to create meaningful impact.",
      },
      {
        id: 2,
        question: "How do we start a project together?",
        answer:
          "Reach out through our contact page with a brief overview of your goals. We'll schedule a discovery call to understand your needs and outline the next steps.",
      },
      {
        id: 3,
        question: "What industries do you work with?",
        answer:
          "We partner with startups, established brands, and organizations across technology, lifestyle, hospitality, and social impact sectors.",
      },
      {
        id: 4,
        question: "How long does a typical project take?",
        answer:
          "Timelines vary by scope. A brand identity project typically takes 6–10 weeks, while larger engagements may run several months. We'll provide a clear timeline during our initial conversation.",
      },
      {
        id: 5,
        question: "Do you work with clients remotely?",
        answer:
          "Yes. We collaborate with clients worldwide through video calls, shared workspaces, and regular check-ins to keep projects moving smoothly.",
      },
    ],
  },
};

export const getFAQData = async (): Promise<FetchFAQResponse> => {
  if (!envVar.API_URL) {
    return DUMMY_FAQ_DATA;
  }

  const response = await fetch(`${envVar.API_URL}/api/faq?populate=*`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${envVar.API_TOKEN}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error("Failed to fetch FAQ");
  return response.json();
};

export const getInformationFAQData = async (): Promise<FetchInformationFAQResponse> => {
  const response = await fetch(
    `${envVar.API_URL}/api/information-faq?populate[main][populate]=how_we_work_main`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envVar.API_TOKEN}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch Information FAQ");
  return response.json();
};
