import { DataSource } from 'typeorm';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { connectionSource } from './typeorm.constant';

@injectable()
export class TypeormConfigService {
	public async ormClient(): Promise<DataSource> {
		return await connectionSource.initialize();
	}
}
