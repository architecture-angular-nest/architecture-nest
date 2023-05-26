import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class GeneralEntity {
  @PrimaryGeneratedColumn()
  id: EntityId;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @Column({ nullable: true })
  status: string;
}
