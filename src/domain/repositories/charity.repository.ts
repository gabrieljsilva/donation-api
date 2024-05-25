import { Charity } from '../../entities';

export abstract class CharityRepository {
  abstract findById(id: number): Promise<Charity>;
  abstract findByIdOrThrowError(id: number): Promise<Charity>;
  abstract findAll(): Promise<Charity[]>;
  abstract create(name: string): Promise<Charity>;
  abstract update(id: number, name: string): Promise<Charity>;
  abstract deleteById(id: number): Promise<Charity>;
  abstract findByIds(ids: Array<number>): Promise<Array<Charity>>;
}
