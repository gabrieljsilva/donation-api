import { Access } from '../../entities';

export abstract class AccessRepository {
  abstract findById(id: number): Promise<Access>;
  abstract findByEmail(email: string): Promise<Access>;
  abstract create(email: string, password: string): Promise<Access>;
  abstract findAll(): Promise<Array<Access>>;
  abstract findAllByIds(donorIds: Array<number>): Promise<Array<Access>>;
}
