import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODES } from '../domain/enum';

export class BaseException<T = unknown> extends HttpException {
  constructor(
    message: string,
    code: EXCEPTION_CODES = EXCEPTION_CODES.INTERNAL_SERVER_ERROR,
    payload?: T,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ message, code, payload: payload }, status);
  }
}
