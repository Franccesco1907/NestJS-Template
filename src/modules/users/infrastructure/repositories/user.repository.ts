import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../../domain/entities/user.entity';
import { OrmBaseRepository } from '@database/orm/repositories';
import { UserRepositoryInterface } from '@modules/users/domain/repositories';

@Injectable()
export class UserRepository
  extends OrmBaseRepository<UserEntity>
  implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {
    super(userRepository.target, dataSource);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}

