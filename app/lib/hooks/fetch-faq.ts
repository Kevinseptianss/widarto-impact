import { useQuery } from "@tanstack/react-query";
import {
  getFAQData,
  getInformationFAQData,
  FetchFAQResponse,
  FetchInformationFAQResponse,
} from "../api/faq";

export const useFetchFAQ = () => {
  return useQuery<FetchFAQResponse>({
    queryKey: ["faq"],
    queryFn: getFAQData,
  });
};

export const useFetchInformationFAQ = () => {
  return useQuery<FetchInformationFAQResponse>({
    queryKey: ["information-faq"],
    queryFn: getInformationFAQData,
  });
};
