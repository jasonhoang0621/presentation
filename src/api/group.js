import { useMutation, useQuery } from "react-query";
import { axiosClient } from ".";

export const useGetListGroup = () => {
  return useQuery("group", () => axiosClient.get("/groups"), {
    staleTime: Infinity,
  });
};

export const useCreateGroup = () => {
  return useMutation((payload) => axiosClient.post("/group", payload));
};

export const useDetailGroup = (id) => {
  return useQuery(["group", id], () => axiosClient.get(`/group/${id}`));
};

export const useAssignRole = (groupId) => {
  return useMutation((payload) => axiosClient.patch(`/group/assign/${groupId}`, payload));
};

export const useRemoveUser = (groupId) => {
  return useMutation((payload) => axiosClient.patch(`/group/${groupId}`, payload));
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
