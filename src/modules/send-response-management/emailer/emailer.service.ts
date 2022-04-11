import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../types';
import { ConfigService } from '../../config/config.service';
import { createTransport } from 'nodemailer';
import { EmailerInterface } from './emailer.interface';

@injectable()
export class MailerService implements EmailerInterface {
	constructor(@inject(TYPES.ConfigService) private configService: ConfigService) {}

	public async sendToEmail(consumer: string, type: string, body: string) {
		const firstConfig = createTransport({
			service: 'gmail',
			host: 'check@gmail.com',
			auth: { user: this.configService.get('GMAIL'), pass: this.configService.get('PASSWORD') },
		});

		const payload = {
			from: 'HealthChecker',
			to: consumer,
			subject: 'Service' + ' ' + type,
			text: body,
		};

		return await firstConfig.sendMail(payload);
	}
}
