import { useMutation, useQuery } from 'react-query';
import { axiosClient } from '.';

export const useGetListPresentation = (id) => {
  return useQuery(
    ['presentation', id],
    () => axiosClient.get(`/presentation?filters[groupId]=${id}`),
    {
      staleTime: 10000
    }
  );
};

export const useCreatePresentation = () => {
  return useMutation((payload) => axiosClient.post('/presentation', payload));
};

export const usePresentPresentation = () => {
  return useMutation((payload) => axiosClient.patch('/present/presentation', payload));
};

export const useExitPresentation = () => {
  return useMutation((payload) => axiosClient.patch('/exit/presentation', payload));
};

export const useDetailPresentation = (id) => {
  return useQuery(['presentation', id], () => axiosClient.get(`/presentation/${id}`));
};

export const useRemovePresentation = (presentationId) => {
  return useMutation((payload) =>
    axiosClient.patch(`/destroy/presentation/${presentationId}`, payload)
  );
};

export const useUpdatePresentation = (presentationId) => {
  return useMutation((payload) => axiosClient.patch(`/presentation/${presentationId}`, payload));
};

export const useGetHistory = (presentationId) => {
  return useQuery(['history', presentationId], () =>
    axiosClient.get(`/history/${presentationId}?skip=0`)
  );
};
