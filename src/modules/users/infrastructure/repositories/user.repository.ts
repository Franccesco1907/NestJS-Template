import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import type { User } from '@modules/users/domain/models';
import { CreateUserInput, UserRepositoryInterface } from '@modules/users/domain/repositories';
import { UserOrmEntity, UserPersistenceMapper } from '../persistence/typeorm';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(@InjectRepository(UserOrmEntity) private readonly userRepository: Repository<UserOrmEntity>) { }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ? UserPersistenceMapper.toDomain(user) : null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id, deletedAt: IsNull() } });
    return user ? UserPersistenceMapper.toDomain(user) : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(UserPersistenceMapper.toOrm(input));

    return UserPersistenceMapper.toDomain(await this.userRepository.save(user));
  }
}
