import { IsEmail, IsOptional } from 'class-validator';

export class CheckerGetListDto {
	@IsEmail()
	@IsOptional()
	email?: string;
}
