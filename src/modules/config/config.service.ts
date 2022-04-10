import { ConfigServiceInterface } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { injectable } from 'inversify';

@injectable()
export class ConfigService implements ConfigServiceInterface {
	private readonly config: DotenvParseOutput;
	constructor() {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			throw new Error('.env file was not loaded');
		} else {
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
