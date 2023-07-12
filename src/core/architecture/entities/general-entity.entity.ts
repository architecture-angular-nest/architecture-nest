import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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
