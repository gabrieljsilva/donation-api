import { Donation } from '../../entities';

export abstract class DonationRepository {
  abstract create(amount: number, donorId: number, charityId: number): Promise<Donation>;
  abstract findAll(): Promise<Array<Donation>>;
  abstract findAllByDonorIds(donorsIds: Array<number>): Promise<Array<Donation>>;
  abstract findAllByCharityId(charityId: number): Promise<Array<Donation>>;
}
