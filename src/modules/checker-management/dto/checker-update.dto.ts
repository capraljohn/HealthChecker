import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckerUpdateDto {
	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	serviceId: string;

	@IsString()
	name: string;

	@IsString()
	url: string;
}
