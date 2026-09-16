import { IsString, IsIn, IsOptional, IsInt } from 'class-validator';

export class CreateServerDto {
  @IsString()
  host!: string;

  @IsOptional()
  @IsInt()
  port?: number;

  @IsString()
  username!: string;

  @IsIn(['password', 'key'])
  authType!: 'password' | 'key';

  @IsString()
  privateKey!: string; // пароль ИЛИ ключ — фронт сам решает, что туда кладёт
}