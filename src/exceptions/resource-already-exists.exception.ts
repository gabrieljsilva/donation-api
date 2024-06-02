import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODES } from '../domain/enum';

type ResourceAlreadyExistsExceptionPayload = Record<string, string | number | boolean>;

export class ResourceAlreadyExistsException extends BaseException<ResourceAlreadyExistsExceptionPayload> {
  constructor(payload: ResourceAlreadyExistsExceptionPayload) {
    super(
      'one or more resources already exists with provided data',
      EXCEPTION_CODES.RESOURCE_ALREADY_EXISTS,
      payload,
      HttpStatus.CONFLICT,
    );
  }
}
