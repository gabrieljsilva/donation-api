import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../constants';
import { AccessRepository } from '../domain/repositories';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    private readonly accessRepository: AccessRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = this.getGQLRequest(context);
    const accessToken = request?.headers?.authorization;
    const token = this.validateToken(accessToken);

    try {
      type AccessPayload = JwtPayload & { accessId: number };
      const payload: AccessPayload = await this.jwtService.verifyAsync(token);

      // Async Local Storage / Continuation Local Storage
      request['access'] = await this.accessRepository.findById(payload.accessId);
    } catch {
      throw new Error('Invalid token');
    }

    return true;
  }

  private getGQLRequest(context: ExecutionContext): Request {
    return GqlExecutionContext.create(context).getContext().req;
  }

  private validateToken(bearerToken: string) {
    if (!bearerToken) {
      throw new Error('Token not found');
    }

    const [type, token] = bearerToken.split(' ');
    if (type !== 'Bearer') {
      throw new Error('invalid token');
    }

    if (!token) {
      throw new Error('invalid token');
    }

    return token;
  }
}
