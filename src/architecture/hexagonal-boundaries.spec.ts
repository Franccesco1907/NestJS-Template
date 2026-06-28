import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const DOMAIN_FORBIDDEN_IMPORT_PATTERNS = [
  /from ['"]typeorm['"]/,
  /from ['"]@database\//,
  /from ['"]@nestjs\//,
  /from ['"].*infrastructure/,
];

const APPLICATION_FORBIDDEN_IMPORT_PATTERNS = [
  /from ['"]typeorm['"]/,
  /from ['"]@database\//,
  /from ['"]@nestjs\//,
  /from ['"]bcrypt['"]/,
  /from ['"]@modules\/[^'"]+\/infrastructure\//,
  /from ['"][^'"]*infrastructure\//,
];

const FRAMEWORK_FREE_FILES = [
  'modules/users/domain/models/user.model.ts',
  'modules/users/domain/repositories/user.repository.interface.ts',
  'modules/users/application/dto/create-user.command.ts',
  'modules/users/application/dto/user.output.ts',
  'modules/users/application/errors/email-already-registered.error.ts',
  'modules/users/application/mappers/user-output.mapper.ts',
  'modules/users/application/ports/password-hasher.port.ts',
  'modules/users/application/use-cases/create-user/create-user.use-case.ts',
  'modules/users/application/use-cases/find-user-by-email/find-user-by-email.use-case.ts',
  'modules/auth/application/dto/login.command.ts',
  'modules/auth/application/dto/login.output.ts',
  'modules/auth/application/errors/invalid-credentials.error.ts',
  'modules/auth/application/ports/token-issuer.port.ts',
  'modules/auth/application/use-cases/login/login.use-case.ts',
];

const DOMAIN_DIRECTORIES = [
  join(__dirname, '..', 'modules/auth/domain'),
  join(__dirname, '..', 'modules/users/domain'),
];
const APPLICATION_DIRECTORIES = [
  join(__dirname, '..', 'modules/auth/application'),
  join(__dirname, '..', 'modules/users/application'),
];

describe('hexagonal boundary PR1 files', () => {
  it.each(FRAMEWORK_FREE_FILES)('%s stays framework-free', (relativePath) => {
    const content = readFileSync(join(__dirname, '..', relativePath), 'utf8');

    for (const forbiddenPattern of DOMAIN_FORBIDDEN_IMPORT_PATTERNS) {
      expect(content).not.toMatch(forbiddenPattern);
    }
  });
});

describe('users domain boundary', () => {
  it.each(DOMAIN_DIRECTORIES.flatMap(listTypeScriptFiles))(
    '%s has no infrastructure or framework imports',
    (filePath) => {
      const content = readFileSync(filePath, 'utf8');

      for (const forbiddenPattern of DOMAIN_FORBIDDEN_IMPORT_PATTERNS) {
        expect(content).not.toMatch(forbiddenPattern);
      }
    },
  );
});

describe('application boundary', () => {
  it.each(APPLICATION_DIRECTORIES.flatMap(listTypeScriptFiles))(
    '%s has no persistence or infrastructure imports',
    (filePath) => {
      const content = readFileSync(filePath, 'utf8');

      for (const forbiddenPattern of APPLICATION_FORBIDDEN_IMPORT_PATTERNS) {
        expect(content).not.toMatch(forbiddenPattern);
      }
    },
  );

  it.each(APPLICATION_DIRECTORIES.flatMap(listTypeScriptFiles))(
    '%s has no Nest or bcrypt imports',
    (filePath) => {
      const content = readFileSync(filePath, 'utf8');

      expect(content).not.toMatch(/from ['"]@nestjs\//);
      expect(content).not.toMatch(/from ['"]bcrypt['"]/);
    },
  );
});

function listTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return listTypeScriptFiles(path);
    }

    return entry.name.endsWith('.ts') ? [path] : [];
  });
}
