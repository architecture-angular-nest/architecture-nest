import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityId } from '../../types/enity-id.type';

export class GeneralEntity {
  @PrimaryGeneratedColumn()
  id: EntityId;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @Column({ nullable: true })
  created_by: EntityId;

  @Column({ nullable: true })
  updated_by: EntityId;

  @Column({ nullable: true })
  deleted_by: EntityId;

  @Column({ nullable: true })
  status: string;
}
