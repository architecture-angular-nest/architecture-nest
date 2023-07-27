import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GeneralEntity } from '../../../core/architecture/entities/typeorm/general-entity.entity';

@Entity('exemplos')
export class Exemplo extends GeneralEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;
}
// export class GeneralEntity {
//   @PrimaryGeneratedColumn()
//   id: EntityId;

//   @DeleteDateColumn({ nullable: true })
//   deleted_at: Date;

//   @CreateDateColumn({ nullable: true })
//   created_at: Date;

//   @Column({ nullable: true })
//   created_by: EntityId;

//   @Column({ nullable: true })
//   updated_by: EntityId;

//   @Column({ nullable: true })
//   deleted_by: EntityId;

//   @Column({ nullable: true })
//   status: string;
// }
