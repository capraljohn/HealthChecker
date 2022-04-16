import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { MailerInterface } from './mailer/mailer.interface';
import { TelegramInterface } from './telegram/telegram.interface';

@injectable()
export class CommonSenderService {
	constructor(
		@inject(TYPES.MailerService) private mailerService: MailerInterface,
		@inject(TYPES.TelegramService) private telegramService: TelegramInterface,
	) {}
	public async sendToPlatform(message: string, type: string, params: any): Promise<void> {
		const { email, sendTg } = params;

		if (email) {
			await this.mailerService.sendToEmail(email, type, message);
		}

		if (sendTg) {
			await this.telegramService.sendToChat(message, sendTg);
		}
	}
}
