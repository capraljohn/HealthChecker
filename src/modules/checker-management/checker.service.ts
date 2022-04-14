import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { CheckerEntity } from './entity/checker.entity';
import { CheckerCreateDto } from './dto/checker-create.dto';
import { CheckerUpdateDto } from './dto/checker-update.dto';
import { Repository } from 'typeorm';
import { connectionSource } from '../config/typeorm.constant';
import { NextFunction } from 'express';
import { HTTPError } from '../../shared/helpers/errors/exepton.service';
import { TYPES } from '../../types';
import { CheckerGetByIdDto } from './dto/checker-get.dto';
import { CheckerRemoveDto } from './dto/checker-remove.dto';
import { CheckerGetListDto } from './dto/checker-get-list.dto';
import { CheckerServiceInterface } from './types/checker-service.interface';
import { MailerInterface } from '../send-response-management/mailer/mailer.interface';
import { TelegramInterface } from '../send-response-management/telegram/telegram.interface';

@injectable()
export class CheckerService implements CheckerServiceInterface {
	private checkerRepository: Repository<CheckerEntity>;
	constructor(
		@inject(TYPES.MailerService) private mailerService: MailerInterface,
		@inject(TYPES.TelegramService) private telegramService: TelegramInterface,
	) {
		this.checkerRepository = connectionSource.getRepository(CheckerEntity);
	}

	async getCurrentServicesList(param: CheckerGetListDto, next: NextFunction) {
		const { email, sendTg } = param;

		const serviceList = await this.checkerRepository.find();

		if (!serviceList) {
			return next(new HTTPError(204, 'No data available'));
		}

		let message = '';

		const services: any[] = [];
		serviceList.map((service) => {
			services.push({
				id: service.id,
				name: service.serviceName,
				url: service.urlService,
				status: service.status,
			});
			message +=
				`Id: ${service.id}\n` +
				`Service ${service.serviceName} ${service.status}\n` +
				`Url ${service.urlService}\n\n`;
		});

		if (email) {
			await this.mailerService.sendToEmail(email, 'updating', message);
		}

		if (sendTg) {
			await this.telegramService.sendToChat(message, sendTg);
		}

		return services;
	}

	async getStatusServiceById(body: CheckerGetByIdDto, next: NextFunction) {
		const { serviceId, email, sendTg } = body;
		const serviceStatus = await this.checkerRepository.findOne({
			where: { id: serviceId },
		});

		if (!serviceStatus) {
			return next(new HTTPError(404, 'Such service not found'));
		}

		const payloadResponse =
			`Service ${serviceStatus.serviceName} ${serviceStatus.status}\n` +
			`Unavailable from ${serviceStatus.unavailableFrom} to ${serviceStatus.unavailableTo}`;

		if (email) {
			await this.mailerService.sendToEmail(email, 'updating', payloadResponse);
		}

		if (sendTg) {
			await this.telegramService.sendToChat(payloadResponse, sendTg);
		}

		return {
			name: serviceStatus.serviceName,
			status: serviceStatus.status,
			unavailableFrom: serviceStatus.unavailableFrom,
			unavailableTo: serviceStatus.unavailableTo,
		};
	}

	async createService(param: CheckerCreateDto, next: NextFunction) {
		const { url, name, email, sendTg } = param;

		const findService = await this.checkerRepository.find({
			where: { urlService: url },
		});

		for (const service of findService) {
			if (service.urlService === url) {
				return next(new HTTPError(400, 'Such service has been created'));
			}
		}

		await this.checkerRepository.save({
			serviceName: name,
			urlService: url,
		});

		const payloadResponse = `Service create with name ${param.name}\n` + `Url ${param.url}/n`;

		if (email) {
			await this.mailerService.sendToEmail(email, 'updating', payloadResponse);
		}

		if (sendTg) {
			await this.telegramService.sendToChat(payloadResponse, sendTg);
		}

		return { name: name, url: url };
	}

	async updateService(param: CheckerUpdateDto, next: NextFunction) {
		const { url, name, serviceId, email, sendTg } = param;

		const serviceExist = await this.checkerRepository.findOne({
			where: {
				id: serviceId,
			},
		});

		if (!serviceExist) {
			return next(new HTTPError(404, 'Service with such id not exist'));
		}

		const updatingService = this.checkerRepository.create({});

		if (name) {
			updatingService.serviceName = name;
		}

		if (url) {
			updatingService.urlService = url;
		}

		await this.checkerRepository.update(serviceExist.id, updatingService);

		const payloadResponse = `Service update\n` + `Name ${param.name}\n` + `Url ${param.url}`;

		if (email) {
			await this.mailerService.sendToEmail(email, 'updating', payloadResponse);
		}

		if (sendTg) {
			await this.telegramService.sendToChat(payloadResponse, sendTg);
		}

		return {
			name: param?.name,
			url: param?.url,
		};
	}

	async removeService(param: CheckerRemoveDto, next: NextFunction) {
		const { serviceId, email, sendTg } = param;
		const serviceExist = await this.checkerRepository.findOne({
			where: {
				id: serviceId,
			},
		});

		if (!serviceExist) {
			return next(new HTTPError(404, 'Service with such id not found'));
		}

		await this.checkerRepository.delete(serviceId);

		const payloadResponse = `Service with id: ${serviceId} removed`;

		if (email) {
			await this.mailerService.sendToEmail(email, 'updating', payloadResponse);
		}

		if (sendTg) {
			await this.telegramService.sendToChat(payloadResponse, sendTg);
		}

		return serviceId;
	}
}
