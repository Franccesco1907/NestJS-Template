import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const FORBIDDEN_IMPORT_PATTERNS = [/from ['"]typeorm['"]/, /from ['"]@database\//, /from ['"]@nestjs\//, /from ['"].*infrastructure/];

const FRAMEWORK_FREE_FILES = [
  'modules/users/domain/models/user.model.ts',
  'modules/users/domain/repositories/user.repository.interface.ts',
  'modules/users/application/dto/create-user.command.ts',
  'modules/users/application/dto/user.output.ts',
  'modules/users/application/mappers/user-output.mapper.ts',
  'modules/auth/application/dto/login.command.ts',
  'modules/auth/application/dto/login.output.ts',
];

const DOMAIN_DIRECTORY = join(__dirname, '..', 'modules/users/domain');

describe('hexagonal boundary PR1 files', () => {
  it.each(FRAMEWORK_FREE_FILES)('%s stays framework-free', (relativePath) => {
    const content = readFileSync(join(__dirname, '..', relativePath), 'utf8');

    for (const forbiddenPattern of FORBIDDEN_IMPORT_PATTERNS) {
      expect(content).not.toMatch(forbiddenPattern);
    }
  });
});

describe('users domain boundary', () => {
  it.each(listTypeScriptFiles(DOMAIN_DIRECTORY))('%s has no infrastructure or framework imports', (filePath) => {
    const content = readFileSync(filePath, 'utf8');

    for (const forbiddenPattern of FORBIDDEN_IMPORT_PATTERNS) {
      expect(content).not.toMatch(forbiddenPattern);
    }
  });
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
