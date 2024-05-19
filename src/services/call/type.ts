import { BaseInterface } from '../type';

export interface CallInterface extends BaseInterface {
  customer_latitude: number;
  customer_longtitude: number;
  description: string;
  driver_id: number;
  driver?: any;
  location: string;
  priority: string;
  status: string;
  user_id: number;
  user?: any;
}

export interface CallListResponse {
  orders?: CallInterface[];
  total_count: any;
}
