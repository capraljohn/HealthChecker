import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../shared/base.controller';
import { TYPES } from '../../types';
import { CheckerGetByIdDto } from './dto/checker-get.dto';
import { CheckerCreateDto } from './dto/checker-create.dto';
import { CheckerUpdateDto } from './dto/checker-update.dto';
import { CheckerRemoveDto } from './dto/checker-remove.dto';
import { CheckerControllerInterface } from './types/checker-controller.interface';
import { ValidateMiddleware } from '../../shared/validate.middleware';
import { CheckerGetListDto } from './dto/checker-get-list.dto';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { CheckerServiceInterface } from './types/checker-service.interface';

@injectable()
export class CheckerController extends BaseController implements CheckerControllerInterface {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.CheckerService) public checkerService: CheckerServiceInterface,
	) {
		super();
		this.bindRoutes([
			{
				path: '/services',
				method: 'get',
				func: this.getCurrentServicesList,
				middlewares: [new ValidateMiddleware(CheckerGetListDto)],
			},
			{
				path: '/service/:id/status',
				method: 'get',
				func: this.getStatusService,
				middlewares: [new ValidateMiddleware(CheckerGetByIdDto)],
			},
			{
				path: '/service/create',
				method: 'post',
				func: this.createService,
				middlewares: [new ValidateMiddleware(CheckerCreateDto)],
			},
			{
				path: '/service/:id/update',
				method: 'put',
				func: this.updateService,
				middlewares: [new ValidateMiddleware(CheckerUpdateDto)],
			},
			{
				path: '/service/:id/delete',
				method: 'delete',
				func: this.removeService,
				middlewares: [new ValidateMiddleware(CheckerRemoveDto)],
			},
		]);
	}

	async getCurrentServicesList(
		{ body }: Request<{}, {}, CheckerGetListDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const list = await this.checkerService.getCurrentServicesList(body, next);
		this.sendMessage(res, 200, list);
	}

	async getStatusService(
		{ body }: Request<{}, {}, CheckerGetByIdDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const status = await this.checkerService.getStatusServiceById(body, next);
		this.sendMessage(res, 200, status);
	}

	async createService(
		{ body }: Request<{}, {}, CheckerCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const create = await this.checkerService.createService(body, next);
		this.sendMessage(res, 201, { created: create });
	}

	async updateService(
		{ body }: Request<{}, {}, CheckerUpdateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const update = await this.checkerService.updateService(body, next);
		this.sendMessage(res, 200, { updated: update });
	}

	async removeService(
		{ body }: Request<{}, {}, CheckerRemoveDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const remove = await this.checkerService.removeService(body, next);
		this.sendMessage(res, 200, { message: `Service with id: ${remove} removed` });
	}
}
