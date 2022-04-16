import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { TYPES } from './types';
import { CheckerControllerInterface } from './modules/checker-management/types/checker-controller.interface';
import { CheckerService } from './modules/checker-management/checker.service';
import { CheckerController } from './modules/checker-management/checker.controller';
import { ConfigServiceInterface } from './modules/config/config.service.interface';
import { ConfigService } from './modules/config/config.service';
import { TypeormConfigService } from './modules/config/typeorm-config.service';
import { ExeptionInterface } from './shared/helpers/errors/exeption.interface';
import { ExeptionFilter } from './shared/helpers/errors/exeption.filter';
import { MailerService } from './modules/send-response-management/mailer/mailer.service';
import { TelegramService } from './modules/send-response-management/telegram/telegram.service';
import { CommonRequestService } from './shared/helpers/common-request/common-request.service';
import { TelegramInterface } from './modules/send-response-management/telegram/telegram.interface';
import { MailerInterface } from './modules/send-response-management/mailer/mailer.interface';
import { CheckerServiceInterface } from './modules/checker-management/types/checker-service.interface';
import { CommonSenderService } from './modules/send-response-management/common-sender.service';

export interface BootstrapReturnInterface {
	appContainer: Container;
	app: App;
}

export const appModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<TypeormConfigService>(TYPES.TypeormConfigService)
		.to(TypeormConfigService)
		.inSingletonScope();
	bind<CommonRequestService>(TYPES.CommonRequestService)
		.to(CommonRequestService)
		.inSingletonScope();
	bind<CheckerControllerInterface>(TYPES.CheckerController).to(CheckerController);
	bind<CheckerServiceInterface>(TYPES.CheckerService).to(CheckerService);
	bind<ExeptionInterface>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<TelegramInterface>(TYPES.TelegramService).to(TelegramService);
	bind<MailerInterface>(TYPES.MailerService).to(MailerService);
	bind<CommonSenderService>(TYPES.CommonSenderService).to(CommonSenderService).inSingletonScope();
	bind<ConfigServiceInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<BootstrapReturnInterface> {
	const appContainer = new Container();
	appContainer.load(appModule);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
