import { OrmBaseRepository } from "@database/orm/repositories";
import { UserEntity } from "../entities/user.entity";

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepositoryInterface extends OrmBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
}
