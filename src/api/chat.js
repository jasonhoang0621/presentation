import { useQuery } from "react-query";
import { axiosClient } from ".";

export const useGetListChat = (presentationId, skip) => {
  return useQuery(["chat", presentationId, skip], () =>
    axiosClient.get(`/chat/${presentationId}?skip=${skip}`)
  );
};
