import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CheckerEntityEnum } from '../types/checker-entity.enum';

@Entity('HealthChecker')
export class CheckerEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: string;

	@Column({ name: 'service_name', type: 'varchar', nullable: true })
	serviceName: string;

	@Column({ name: 'url_service', type: 'varchar', nullable: true })
	urlService: string;

	@Column({
		name: 'status',
		type: 'enum',
		enum: CheckerEntityEnum,
		default: CheckerEntityEnum.AVAILABLE,
	})
	status: CheckerEntityEnum;

	@Column({ name: 'unavailable_from', type: 'varchar', nullable: true })
	unavailableFrom: string;

	@Column({ name: 'unavailable_to', type: 'varchar', nullable: true })
	unavailableTo: string;
}
