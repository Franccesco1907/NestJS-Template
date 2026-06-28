export const PASSWORD_HASHER = 'PASSWORD_HASHER';

export interface PasswordHasherPort {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hashedText: string): Promise<boolean>;
}
