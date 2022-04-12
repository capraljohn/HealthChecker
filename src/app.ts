import express, { Express } from 'express';
import { Server } from 'http';
import { json } from 'body-parser';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { CheckerController } from './modules/checker-management/checker.controller';
import { TypeormConfigService } from './modules/config/typeorm-config.service';
import { ExeptionFilter } from './shared/helpers/errors/exeption.filter';
import { CommonRequestService } from './shared/helpers/common-request/common-request.service';

@injectable()
export class App {
	app: Express;
	server!: Server;
	port: number;

	constructor(
		@inject(TYPES.CheckerController)
		private checkerController: CheckerController,
		@inject(TYPES.TypeormConfigService) private typeormConfigService: TypeormConfigService,
		@inject(TYPES.CommonRequestService)
		private commonRequestService: CommonRequestService,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
	) {
		this.app = express();
		this.port = 3000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRouters(): void {
		this.app.use('/healthcheck', this.checkerController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	customCrone() {
		setInterval(async () => {
			await this.commonRequestService.requestOnUrl();
		}, 5000);
	}

	public async init(): Promise<void> {
		await this.typeormConfigService.ormClient();
		this.useMiddleware();
		this.useRouters();
		this.useExeptionFilters();
		this.customCrone();
		this.server = this.app.listen(this.port);
		console.info(`Server has been started on port: ${this.port}`);
	}
}
