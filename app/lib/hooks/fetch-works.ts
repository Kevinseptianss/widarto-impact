import { useQuery } from "@tanstack/react-query";
import {
  getWorksData,
  getWorkDetailData,
  FetchWorkListResponse,
  FetchWorkDetailResponse,
  getWorkListOnContact,
  FetchGalleryContactResponse,
  getGalleryContact,
} from "../api/works";

export const useFetchWorks = (slug?: string) => {
  return useQuery<FetchWorkListResponse>({
    queryKey: ["works"],
    queryFn: () => getWorksData(slug),
  });
};

export const useFetchWorkDetail = (slug: string, initialData?: FetchWorkDetailResponse) => {
  return useQuery<FetchWorkDetailResponse>({
    queryKey: ["work-detail", slug],
    queryFn: () => getWorkDetailData(slug),
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFetchWorkListOnContact = (slug?: string) => {
  return useQuery<FetchWorkListResponse>({
    queryKey: ["work-list-on-contact"],
    queryFn: () => getWorkListOnContact(slug),
  });
};

export const useFetchPhotoGalleryContact = () => {
  return useQuery<FetchGalleryContactResponse>({
    queryKey: ["photo-gallery-contact"],
    queryFn: () => getGalleryContact(),
  });
};
