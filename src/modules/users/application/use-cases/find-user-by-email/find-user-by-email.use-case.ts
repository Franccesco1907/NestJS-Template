import type { UserRepositoryInterface } from '@modules/users/domain/repositories';

interface FindUserByEmailQuery {
  email: string;
}

export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(query: FindUserByEmailQuery) {
    return this.userRepository.findByEmail(query.email);
  }
}
