import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateAccessDto, MakeLoginDto } from './dto';
import { Access } from '../../entities';
import { Encrypt } from '../../utils/encryption';
import { AccessRepository, DonorRepository } from '../../domain/repositories';

@Injectable()
export class AccessControlService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly accessRepository: AccessRepository,
    private readonly donorRepository: DonorRepository,
  ) {}

  async createAccess(createAccessDto: CreateAccessDto): Promise<Access> {
    const accessAlreadyExists = await this.accessRepository.findByEmail(createAccessDto.email);

    if (accessAlreadyExists) {
      throw new Error('a access with this email already exists');
    }

    const access = await this.accessRepository.create(
      createAccessDto.email,
      await Encrypt.hash(createAccessDto.password),
    );

    await this.donorRepository.create(access.id, createAccessDto.name, createAccessDto.birthDate);

    return access;
  }

  async login({ email, password }: MakeLoginDto) {
    const access = await this.accessRepository.findByEmail(email);

    if (!access) {
      throw new Error('access not found');
    }

    const passwordMatch = await Encrypt.compare(password, access.password);

    if (!passwordMatch) {
      throw new Error('password does not match');
    }

    return this.jwtService.signAsync({ accessId: access.id });
  }

  async findAll() {
    return this.accessRepository.findAll();
  }
}
