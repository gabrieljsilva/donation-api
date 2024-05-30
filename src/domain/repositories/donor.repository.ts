import { Donor } from '../../entities';

export abstract class DonorRepository {
  abstract findById(id: number): Promise<Donor>;
  abstract findByIdOrThrowError(id: number): Promise<Donor>;
  abstract findByAccessIds(accessIds: number[]): Promise<Array<Donor>>;
  abstract create(accessId: number, name: string, birthDate: Date): Promise<Donor>;
  abstract findAll(): Promise<Array<Donor>>;
  abstract findByAccessId(accessId: number): Promise<Donor>;
  abstract findByIds(ids: number[]): Promise<Array<Donor>>;
}
