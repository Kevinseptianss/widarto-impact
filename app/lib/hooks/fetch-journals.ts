import { useQuery } from "@tanstack/react-query";
import {
  getJournalsData,
  getJournalDetailData,
  FetchJournalsResponse,
} from "../api/journals";

export const useFetchJournals = (slug?: string, initialData?: FetchJournalsResponse) => {
  return useQuery<FetchJournalsResponse>({
    queryKey: ["journals", slug],
    queryFn: () => getJournalsData(slug),
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFetchJournalDetail = (slug: string, initialData?: FetchJournalsResponse) => {
  return useQuery<FetchJournalsResponse>({
    queryKey: ["journal", slug],
    queryFn: () => getJournalDetailData(slug),
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
