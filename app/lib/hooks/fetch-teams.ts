import { useQuery } from "@tanstack/react-query";
import { getTeamsData, FetchTeamsResponse } from "../api/teams";

export const useFetchTeams = () => {
  return useQuery<FetchTeamsResponse>({
    queryKey: ["teams"],
    queryFn: getTeamsData,
  });
};
