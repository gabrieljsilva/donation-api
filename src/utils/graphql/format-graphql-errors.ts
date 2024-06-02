import { GraphQLError } from 'graphql';
import { BaseException } from '../../exceptions';
import { EXCEPTION_CODES } from '../../domain/enum';
import { Exception } from '../../domain/interfaces';
import type { GraphQLFormattedError } from 'graphql/index';

export function formatError(formattedError: GraphQLFormattedError, error: GraphQLError) {
  const originalError = error.originalError as BaseException | Error;

  if (originalError instanceof BaseException) {
    const { message, code, payload } = originalError.getResponse() as Exception;

    return {
      message: message || error.message,
      code: code || EXCEPTION_CODES.INTERNAL_SERVER_ERROR,
      payload: payload,
    };
  }

  return {
    message: error.message,
    code: EXCEPTION_CODES.INTERNAL_SERVER_ERROR,
  };
}
