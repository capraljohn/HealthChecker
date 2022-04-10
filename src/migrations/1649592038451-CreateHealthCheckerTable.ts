import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHealthCheckerTable1649592038451 implements MigrationInterface {
	name = 'CreateHealthCheckerTable1649592038451';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."HealthChecker_status_enum" AS ENUM('available', 'unavailable')`,
		);
		await queryRunner.query(
			`CREATE TABLE "HealthChecker" ("id" BIGSERIAL NOT NULL, "service_name" character varying, "url_service" character varying, "status" "public"."HealthChecker_status_enum" NOT NULL DEFAULT 'available', "unavailable_from" character varying, "unavailable_to" character varying, CONSTRAINT "PK_5ef98a876e9dfadad6448c490ef" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "HealthChecker"`);
		await queryRunner.query(`DROP TYPE "public"."HealthChecker_status_enum"`);
	}
}
