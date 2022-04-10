import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { TYPES } from './types';
// import { CommonRequestService } from './shared/requests/common-request.service';
import { CheckerControllerInterface } from './modules/checker-management/types/checker-controller.interface';
import { CheckerService } from './modules/checker-management/checker.service';
import { CheckerController } from './modules/checker-management/checker.controller';
import { ConfigServiceInterface } from './modules/config/config.service.interface';
import { ConfigService } from './modules/config/config.service';
import { TypeormConfigService } from './modules/config/typeorm-config.service';
import { ExeptionInterface } from './shared/helpers/errors/exeption.interface';
import { ExeptionFilter } from './shared/helpers/errors/exeption.filter';
import { MailerService } from './modules/send-response-management/email/emailer.service';

export interface BootstrapReturnInterface {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<TypeormConfigService>(TYPES.TypeormConfigService)
		.to(TypeormConfigService)
		.inSingletonScope();
	bind<CheckerControllerInterface>(TYPES.CheckerController).to(CheckerController);
	// bind<CommonRequestService>(TYPES.CommonRequestService)
	// 	.to(CommonRequestService)
	// 	.inSingletonScope();
	bind<ExeptionInterface>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<MailerService>(TYPES.MailerService).to(MailerService);
	bind<CheckerService>(TYPES.CheckerService).to(CheckerService);
	bind<ConfigServiceInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<BootstrapReturnInterface> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
