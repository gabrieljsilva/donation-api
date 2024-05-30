import { Donation } from '../../entities';

export abstract class DonationRepository {
  abstract create(amount: number, donorId: number, charityId: number): Promise<Donation>;
  abstract findAll(): Promise<Array<Donation>>;
  abstract findAllByDonorIds(donorsIds: Array<number>): Promise<Array<Donation>>;
  abstract findAllByCharitiesIds(charitiesIds: Array<number>): Promise<Array<Donation>>;
}
