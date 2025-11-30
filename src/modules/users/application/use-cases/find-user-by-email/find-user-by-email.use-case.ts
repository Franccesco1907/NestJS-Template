import { USER_REPOSITORY, UserRepositoryInterface } from '@modules/users/domain/repositories';
import { Inject, Injectable } from '@nestjs/common';

interface FindUserByEmailQuery {
  email: string;
}

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) { }

  async execute(query: FindUserByEmailQuery) {
    return this.userRepository.findByEmail(query.email);
  }
}
