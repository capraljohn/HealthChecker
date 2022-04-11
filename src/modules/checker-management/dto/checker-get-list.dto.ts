import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckerGetListDto {
	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	sendTg?: string;
}
