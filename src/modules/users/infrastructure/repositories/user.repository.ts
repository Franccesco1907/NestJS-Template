import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserInput, UserRepositoryInterface } from '@modules/users/domain/repositories';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id, deletedAt: IsNull() } });
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const user = this.userRepository.create({
      email: input.email,
      password: input.password,
      role: input.role as UserEntity['role'],
      firstName: input.firstName,
      lastName: input.lastName,
    });

    return this.userRepository.save(user);
  }
}
