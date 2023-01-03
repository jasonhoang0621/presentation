import { useQuery } from 'react-query';
import { axiosClient } from '.';

export const useGetListQuestion = (presentationId, skip, limit) => {
  return useQuery(['question', presentationId, skip], () =>
    axiosClient.get(`/question/${presentationId}?skip=${skip}&limit=${limit}`)
  );
};
