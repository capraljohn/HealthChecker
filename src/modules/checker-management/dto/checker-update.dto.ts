import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckerUpdateDto {
	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	sendTg?: string;

	@IsString()
	serviceId: string;

	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	url?: string;
}
