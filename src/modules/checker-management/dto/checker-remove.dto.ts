import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckerRemoveDto {
	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	serviceId: string;
}
