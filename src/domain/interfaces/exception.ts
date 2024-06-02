import { EXCEPTION_CODES } from '../enum';

export interface Exception<T = any> {
  message: string;
  code: EXCEPTION_CODES;
  payload?: T;
}
