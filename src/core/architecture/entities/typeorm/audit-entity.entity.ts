import { EntityId } from '../../types/enity-id.type';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class AuditEntity {
  @PrimaryGeneratedColumn()
  id: EntityId;

  @Column()
  timestamp: Date;

  @Column()
  action: string;

  @Column({ nullable: true })
  actionDoneBy: EntityId;

  @Column({ nullable: true })
  entityId: EntityId;

  @Column({ nullable: true })
  actionDescription: string;

  @Column({ nullable: true, type: 'json' })
  oldValue: object;

  @Column({ nullable: true, type: 'json' })
  newValue: object;
}
