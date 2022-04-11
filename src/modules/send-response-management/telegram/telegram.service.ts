import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Telegraf } from 'telegraf';
import { TYPES } from '../../../types';
import { ConfigService } from '../../config/config.service';

@injectable()
export class TelegramService {
	private bot: Telegraf;
	private chatId: string;
	private token: string;

	constructor(@inject(TYPES.ConfigService) private configService: ConfigService) {
		this.token = this.configService.get('BOT_TOKEN');
		this.chatId = this.configService.get('CHAT_ID');

		this.bot = new Telegraf(this.token);
	}

	async sendToChat(message: string, chatId: string = this.chatId) {
		return await this.bot.telegram.sendMessage(chatId, message);
	}
}
