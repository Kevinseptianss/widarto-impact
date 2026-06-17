import { envVar } from "@/config/env-var";

export type Program = {
  id: string;
  question: string;
  description: string;
  answer: string;
  button_identification:
    | "brand-refresh"
    | "brand-audit"
    | "brand-creation"
    | "scale-up"
    | "turnaround";
};

export type FetchProgramResponse = {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    main: Program[];
  };
};

export const getProgramsData = async (): Promise<FetchProgramResponse> => {
  const response = await fetch(`${envVar.API_URL}/api/program?populate=*`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${envVar.API_TOKEN}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch programs");
  return response.json();
};
