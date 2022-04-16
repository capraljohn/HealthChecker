import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../types';
import { Repository } from 'typeorm';
import { CheckerEntity } from '../../../modules/checker-management/entity/checker.entity';
import { connectionSource } from '../../../modules/config/typeorm.constant';
import axios from 'axios';
import { endOfDay, format } from 'date-fns';
import { CheckerEntityEnum } from '../../../modules/checker-management/types/checker-entity.enum';
import { HTTPError } from '../errors/exepton.service';
import { ExeptionInterface } from '../errors/exeption.interface';
import { ConfigServiceInterface } from '../../../modules/config/config.service.interface';
import { CommonRequestEnum } from './types/common-request.enum';

@injectable()
export class CommonRequestService {
	private checkerRepository: Repository<CheckerEntity>;

	constructor(
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
	) {
		this.checkerRepository = connectionSource.getRepository(CheckerEntity);
	}

	public async requestOnUrl() {
		const currentServices = await this.checkerRepository
			.createQueryBuilder('hc')
			.select()
			.getMany();

		const bedStatusCodeArray = Object.keys(CommonRequestEnum).filter((num) => num.length == 3);

		for (const url of currentServices) {
			try {
				const { status } = await axios.get(url.urlService, {
					timeout: 10000,
					timeoutErrorMessage: 'Request time exceeded',
				});

				const currentDate = format(endOfDay(new Date()), 'yyyy-MM-dd|HH:mm:ss');

				for (const bedStatusCode of bedStatusCodeArray) {
					const iterableStatusCode = Number(bedStatusCode);

					if (url.unavailableTo === null && status === iterableStatusCode) {
						await this.checkerRepository.update(url.id, {
							unavailableTo: currentDate,
							status: CheckerEntityEnum.UNAVAILABLE,
						});
					}

					if (url.unavailableTo !== null && status === iterableStatusCode) {
						await this.checkerRepository.update(url.id, {
							status: CheckerEntityEnum.UNAVAILABLE,
						});
					}

					if (url.unavailableTo !== null && status !== iterableStatusCode) {
						await this.checkerRepository.update(url.id, {
							unavailableFrom: currentDate,
							status: CheckerEntityEnum.AVAILABLE,
						});
					}
				}
			} catch (err) {
				new HTTPError(400, 'Bad request');
			}
		}
	}
}
