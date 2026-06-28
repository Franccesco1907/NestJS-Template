import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

enum NodeEnv {
  development = 'development',
  production = 'production',
  test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsInt()
  @Type(() => Number)
  API_PORT: number;

  @IsInt()
  @Type(() => Number)
  TIMEOUT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsInt()
  @Type(() => Number)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  CORS_ORIGINS: string;

  @IsString()
  CORS_METHODS: string;

  @IsString()
  CORS_ALLOWED_HEADERS: string;

  @IsString()
  CORS_EXPOSED_HEADERS: string;

  @IsString()
  CORS_CREDENTIALS: string;

  @IsString()
  CACHE_HOST: string;

  @IsInt()
  @Type(() => Number)
  CACHE_PORT: number;

  @IsString()
  CACHE_PASSWORD: string;

  @MinLength(12)
  @IsString()
  JWT_SECRET: string;
}
