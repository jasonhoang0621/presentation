import { useMutation, useQuery } from "react-query";
import { axiosClient } from ".";

export const useGetListPresentation = (id) => {
  return useQuery(
    ["presentation", id],
    () => axiosClient.get(`/presentation?filters[groupId]=${id}`),
    {
      staleTime: 10000,
    }
  );
};

export const useCreatePresentation = () => {
  return useMutation((payload) => axiosClient.post("/presentation", payload));
};

export const useDetailPresentation = (id) => {
  return useQuery(["presentation", id], () =>
    axiosClient.get(`/presentation/${id}`)
  );
};

export const useRemovePresentation = (presentationId) => {
  return useMutation((payload) =>
    axiosClient.patch(`/destroy/presentation/${presentationId}`, payload)
  );
};

export const useInviteUser = (groupId) => {
  return useMutation((payload) =>
    axiosClient.post(`/invite/${groupId}`, payload)
  );
};
export const useAcceptInvite = (inviteId) => {
  return useMutation((payload) =>
    axiosClient.post(`/invite/accept/${inviteId}`, payload)
  );
};
