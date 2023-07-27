import { Entity } from 'typeorm';
import { AuditEntity } from '../../../core/architecture/entities/typeorm/audit-entity.entity';

@Entity('exemplos_audit')
export class ExemploAudit extends AuditEntity {}
// export class AuditEntity {
//     @PrimaryGeneratedColumn()
//     id: EntityId;

//     @Column()
//     timestamp: Date;

//     @Column()
//     action: string;

//     @Column({ nullable: true })
//     actionDoneBy: EntityId;

//     @Column({ nullable: true })
//     entityId: EntityId;

//     @Column({ nullable: true })
//     actionDescription: string;

//     @Column({ nullable: true, type: 'json' })
//     oldValue: object;

//     @Column({ nullable: true, type: 'json' })
//     newValue: object;
//   }
