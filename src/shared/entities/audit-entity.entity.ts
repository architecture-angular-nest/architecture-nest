import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column()
  action: string;

  @Column({ nullable: true })
  actionDoneBy: number;

  @Column({ nullable: true })
  entityId: number;

  @Column({ nullable: true })
  actionDescription: string;

  @Column({ nullable: true, type: 'json' })
  oldValue: object;

  @Column({ nullable: true, type: 'json' })
  newValue: object;
}
