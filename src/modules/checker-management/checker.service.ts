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
import { MailerService } from '../send-response-management/email/emailer.service';
import { CheckerGetByIdDto } from './dto/checker-get.dto';
import { CheckerRemoveDto } from './dto/checker-remove.dto';

@injectable()
export class CheckerService {
	private checkerRepository: Repository<CheckerEntity>;
	constructor(@inject(TYPES.MailerService) private mailerService: MailerService) {
		this.checkerRepository = connectionSource.getRepository(CheckerEntity);
	}

	async getCurrentServicesList(email: string | undefined, next: NextFunction) {
		const serviceList = await this.checkerRepository.find();

		if (!serviceList) {
			return next(new HTTPError(204, 'No data available'));
		}

		let message: string = ``;

		const services: any[] = [];
		serviceList.map((service) => {
			services.push({
				id: service.id,
				name: service.serviceName,
				url: service.urlService,
				status: service.status,
			});
			message = `
			 Id: ${service.id},
			 Service ${service.serviceName} ${service.status},
 			 Url ${service.urlService}\n
			`;
		});

		if (email !== undefined) {
			return await this.mailerService.sendToEmail(email, 'list', message);
		}

		return services;
	}

	async getStatusServicesById(body: CheckerGetByIdDto, next: NextFunction) {
		const { serviceId, email } = body;
		const serviceStatus = await this.checkerRepository.findOne({
			where: { id: serviceId },
		});

		if (!serviceStatus) {
			return next(new HTTPError(404, 'Such service not found'));
		}

		if (email !== undefined) {
			await this.mailerService.sendToEmail(
				email,
				'list',
				`
			 Service ${serviceStatus.serviceName} ${serviceStatus.status},
 			 Unavailable from ${serviceStatus.unavailableFrom} to ${serviceStatus.unavailableTo}
 					`,
			);
		}

		return {
			status: serviceStatus.status,
			unavailableFrom: serviceStatus.unavailableFrom,
			unavailableTo: serviceStatus.unavailableTo,
		};
	}

	async createService(param: CheckerCreateDto, next: NextFunction) {
		const { url, name, email } = param;

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

		if (email !== undefined) {
			return await this.mailerService.sendToEmail(
				email,
				'list',
				`
			Service create with name ${param.name}
			Url ${param.url}
			`,
			);
		}

		return param;
	}

	async updateService(param: CheckerUpdateDto, next: NextFunction) {
		const { url, name, serviceId, email } = param;

		const serviceExist = await this.checkerRepository.findOne({
			where: {
				id: serviceId,
			},
		});

		if (!serviceExist) {
			return next(new HTTPError(404, 'Service with such id not exist'));
		}

		await this.checkerRepository.update(serviceExist.id, {
			urlService: url,
			serviceName: name,
		});

		const getUpdate = {
			name: param.name,
			url: param.url,
		};

		if (email !== undefined) {
			return await this.mailerService.sendToEmail(
				email,
				'list',
				`
			Service update
			Name ${param.name}
			Url ${param.url}
			`,
			);
		}

		return getUpdate;
	}

	async removeService(param: CheckerRemoveDto, next: NextFunction) {
		const { serviceId, email } = param;
		const serviceExist = await this.checkerRepository.findOne({
			where: {
				id: serviceId,
			},
		});

		if (!serviceExist) {
			return next(new HTTPError(404, 'Service with such id not found'));
		}

		await this.checkerRepository.delete(serviceId);

		if (email !== undefined) {
			return await this.mailerService.sendToEmail(
				email,
				'list',
				`Service with id: ${serviceId} removed`,
			);
		}

		return serviceId;
	}
}
