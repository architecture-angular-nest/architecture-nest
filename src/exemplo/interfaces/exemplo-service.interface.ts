import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';
import { EntityId } from 'src/core/architecture/types/enity-id';
import { ExemploAudit } from '../entities/exemplo-audit.entity';
import { Exemplo } from '../entities/exemplo.entity';
import { CreateExemploDto } from '../dto/create-exemplo.dto';
import { CrudWithAuditOperations } from 'src/core/architecture/interfaces/crud-with-audit-operations';
import { UpdateExemploDto } from '../dto/update-exemplo.dto';

export interface IExemploService
    extends CrudWithAuditOperations<
        Exemplo,
        ExemploAudit,
        EntityId,
        CreateExemploDto
    > {
    createEntity(
        createEntityDto: CreateExemploDto,
        actionDoneBy?: Express.User,
    ): Promise<Exemplo>;
    findAllEntity(): Promise<Exemplo[]>;
    findOneEntity(id?: number, options?: object): Promise<Exemplo>;
    updateEntity(
        id: number,
        updateEntityDto: UpdateExemploDto,
        actionDoneBy?: Express.User,
    ): Promise<Exemplo>;
    removeEntity(id: number, actionDoneBy?: Express.User): Promise<void>;
}
