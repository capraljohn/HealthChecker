import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckerCreateDto {
	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	sendTg?: string;

	@IsString()
	name: string;

	@IsString()
	url: string;
}
