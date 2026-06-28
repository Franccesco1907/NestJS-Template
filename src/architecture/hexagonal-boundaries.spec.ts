import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

type ForbiddenImportRule = {
  label: string;
  matches: (source: string) => boolean;
};

const FORBIDDEN_IMPORT_RULES: ForbiddenImportRule[] = [
  {
    label: 'Nest',
    matches: (source) => source.startsWith('@nestjs/'),
  },
  {
    label: 'TypeORM',
    matches: (source) => source === 'typeorm' || source.startsWith('typeorm/'),
  },
  {
    label: 'database adapter',
    matches: (source) =>
      source.startsWith('@database/') ||
      source.includes('/database/') ||
      source.endsWith('/database'),
  },
  {
    label: 'infrastructure adapter',
    matches: (source) => source.startsWith('@modules/') && source.includes('/infrastructure/'),
  },
  {
    label: 'infrastructure adapter',
    matches: (source) =>
      source.includes('/infrastructure/') ||
      source.endsWith('/infrastructure') ||
      source.startsWith('infrastructure/'),
  },
  {
    label: 'bcrypt',
    matches: (source) => source === 'bcrypt' || source.startsWith('bcrypt/'),
  },
];

const IMPORT_SOURCE_PATTERN =
  /\b(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;

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

    expect(findForbiddenImportViolations(content)).toEqual([]);
  });
});

describe('domain boundary', () => {
  it.each(DOMAIN_DIRECTORIES.flatMap(listTypeScriptFiles))(
    '%s has no infrastructure or framework imports',
    (filePath) => {
      const content = readFileSync(filePath, 'utf8');

      expect(findForbiddenImportViolations(content)).toEqual([]);
    },
  );
});

describe('application boundary', () => {
  it.each(APPLICATION_DIRECTORIES.flatMap(listTypeScriptFiles))(
    '%s has no persistence or infrastructure imports',
    (filePath) => {
      const content = readFileSync(filePath, 'utf8');

      expect(findForbiddenImportViolations(content)).toEqual([]);
    },
  );

  it.each(APPLICATION_DIRECTORIES.flatMap(listTypeScriptFiles))(
    '%s has no Nest or bcrypt imports',
    (filePath) => {
      const content = readFileSync(filePath, 'utf8');
      const nestOrBcryptViolations = findForbiddenImportViolations(content).filter(
        (source) =>
          source.startsWith('@nestjs/') || source === 'bcrypt' || source.startsWith('bcrypt/'),
      );

      expect(nestOrBcryptViolations).toEqual([]);
    },
  );
});

describe('strict boundary import detection', () => {
  it.each([
    ["import { Injectable } from '@nestjs/common';", '@nestjs/common'],
    [
      "import type { Repository } from 'typeorm/repository/Repository';",
      'typeorm/repository/Repository',
    ],
    ["import '@database/orm/entities';", '@database/orm/entities'],
    ["import * as bcrypt from 'bcrypt';", 'bcrypt'],
    [
      "import { UserRepository } from '../infrastructure/repositories';",
      '../infrastructure/repositories',
    ],
  ])('flags forbidden import source %s', (content, forbiddenImport) => {
    expect(findForbiddenImportViolations(content)).toContain(forbiddenImport);
  });

  it('allows application and domain imports', () => {
    const content = [
      "import { UserModel } from '@modules/users/domain/models';",
      "import { LoginCommand } from '../dto';",
    ].join('\n');

    expect(findForbiddenImportViolations(content)).toEqual([]);
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

function findForbiddenImportViolations(content: string): string[] {
  const importSources = extractImportSources(content);

  return importSources.filter((source) =>
    FORBIDDEN_IMPORT_RULES.some((rule) => rule.matches(source)),
  );
}

function extractImportSources(content: string): string[] {
  return Array.from(content.matchAll(IMPORT_SOURCE_PATTERN), (match) => match[1] ?? match[2]);
}
