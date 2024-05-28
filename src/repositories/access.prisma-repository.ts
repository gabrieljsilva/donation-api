import { Injectable } from '@nestjs/common';
import { AccessRepository } from '../domain/repositories';
import { PrismaService } from '../infra/database';
import { Access } from '../entities';
import { DataloaderHandler, AliasFor } from '../third-party/dataloader/decorators';

@Injectable()
@AliasFor(AccessRepository)
export class AccessPrismaRepository extends AccessRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  @DataloaderHandler('LOAD_ACCESS_BY_ID')
  async findAllByIds(accessIds: number[]): Promise<Access[]> {
    return this.prisma.access.findMany({
      where: {
        id: {
          in: accessIds,
        },
      },
    });
  }

  async findById(id: number): Promise<Access> {
    return this.prisma.access.findFirst({ where: { id } });
  }

  async findByEmail(email: string): Promise<Access> {
    return this.prisma.access.findFirst({ where: { email } });
  }

  async create(email: string, password: string): Promise<Access> {
    return this.prisma.access.create({
      data: {
        email,
        password,
      },
    });
  }

  async findAll() {
    return this.prisma.access.findMany();
  }
}
