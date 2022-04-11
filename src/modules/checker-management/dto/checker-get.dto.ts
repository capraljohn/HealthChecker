import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckerGetByIdDto {
	@IsString()
	serviceId: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	sendTg?: string;
}
