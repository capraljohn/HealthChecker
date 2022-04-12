import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../types';
import { ExeptionFilter } from '../errors/exeption.filter';
import { Repository } from 'typeorm';
import { CheckerEntity } from '../../../modules/checker-management/entity/checker.entity';
import { connectionSource } from '../../../modules/config/typeorm.constant';
import axios from 'axios';
import { ConfigService } from '../../../modules/config/config.service';
import { endOfDay, format } from 'date-fns';
import { CheckerEntityEnum } from '../../../modules/checker-management/types/checker-entity.enum';
import { HTTPError } from '../errors/exepton.service';

@injectable()
export class CommonRequestService {
	private checkerRepository: Repository<CheckerEntity>;

	constructor(
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
		@inject(TYPES.ConfigService) private configService: ConfigService,
	) {
		this.checkerRepository = connectionSource.getRepository(CheckerEntity);
	}

	public async requestOnUrl() {
		const currentServices = await this.checkerRepository
			.createQueryBuilder('hc')
			.select()
			.getMany();

		for (const url of currentServices) {
			try {
				const { status } = await axios.get(url.urlService);

				const currentDate = format(endOfDay(new Date()), 'yyyy-MM-dd|HH:mm:ss');

				if (url.unavailableTo === null && status === (404 | 500 | 422)) {
					await this.checkerRepository.update(url.id, {
						unavailableTo: currentDate,
						status: CheckerEntityEnum.UNAVAILABLE,
					});
				}

				if (url.unavailableTo !== null && status === (404 | 500 | 422)) {
					await this.checkerRepository.update(url.id, {
						status: CheckerEntityEnum.UNAVAILABLE,
					});
				}

				if (url.unavailableTo !== null && status !== (404 | 500 | 422)) {
					await this.checkerRepository.update(url.id, {
						unavailableFrom: currentDate,
						status: CheckerEntityEnum.AVAILABLE,
					});
				}
			} catch (err) {
				new HTTPError(400, 'Bad request');
			}
		}
	}
}
