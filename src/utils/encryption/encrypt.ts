import { hash, compare, genSalt } from 'bcrypt';

export class Encrypt {
  static async hash(data: string) {
    return hash(data, await genSalt(8));
  }

  static async compare(data: string, hash: string) {
    return compare(data, hash);
  }
}
