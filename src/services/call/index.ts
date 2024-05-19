import axiosInstance from 'src/utils/axios';
import { CallListResponse } from './type';

namespace callService {
  export const list = (status: string) => axiosInstance.get<CallListResponse>(`/orders?status=${status}`);
}

export default callService;
