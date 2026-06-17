import { envVar } from "@/config/env-var";

export type Teams = {
  id: number;
  name: string;
  position: string;
  about: string;
};

export type FetchTeamsResponse = {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    main: Teams[];
  };
};

export const getTeamsData = async (): Promise<FetchTeamsResponse> => {
  const response = await fetch(
    `${envVar.API_URL}/api/teams-information?populate=*`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envVar.API_TOKEN}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch teams");
  return response.json();
};
