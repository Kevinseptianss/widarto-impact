import { useQuery } from "@tanstack/react-query";
import { getProgramsData, FetchProgramResponse } from "../api/programs";

export const useFetchProgram = () => {
  return useQuery<FetchProgramResponse>({
    queryKey: ["programs"],
    queryFn: getProgramsData,
  });
};
