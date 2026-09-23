import { IsString, IsIn, IsOptional, IsInt } from 'class-validator';

export class CreateServerDto {
  @IsString()
  host!: string;

  @IsOptional()
  @IsInt()
  port?: number;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsIn(['password', 'key'])
  authType!: 'password' | 'key';
}