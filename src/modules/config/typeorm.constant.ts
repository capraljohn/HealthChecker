import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
	migrationsTableName: 'migrations',
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'admin',
	password: 'admin',
	database: 'healthchecker',
	logging: false,
	synchronize: false,
	name: 'default',
	entities: ['src/**/**.entity{.ts,.js}'],
	migrations: ['src/migrations/**/*{.ts,.js}'],
	subscribers: ['src/subscriber/**/*{.ts,.js}'],
});
