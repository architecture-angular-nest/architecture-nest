import { Injectable } from '@nestjs/common';

import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';
import { ExemploTypeOrm } from './entities/typeorm/exemplo.entity';
import { EntityId } from '../core/architecture/types/enity-id.type';
import { IExemploService } from './interfaces/exemplo-service.interface';
import { ExemploAuditTypeOrm } from './entities/typeorm/exemplo-audit.sentity';
import { IExemploRepository } from './interfaces/exemplo-repository.interface';
import { ActionAuditEnum } from './../core/architecture/enums/action-audit.enum';
import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';

@Injectable()
export class ExemploService
  extends CrudWithAuditService<
    ExemploTypeOrm,
    ExemploAuditTypeOrm,
    EntityId,
    CreateExemploDto
  >
  implements IExemploService
{
  constructor(protected exemploRepository: IExemploRepository) {
    super(exemploRepository);
  }

  public createEntity<T>(
    createEntityDto: CreateExemploDto,
    actionDoneBy?: T,
  ): Promise<ExemploTypeOrm> {
    return this.createEntity(createEntityDto, actionDoneBy['id']);
  }

  public findAllEntity(): Promise<ExemploTypeOrm[]> {
    return this.find();
  }

  public findOneEntityById(id: number): Promise<ExemploTypeOrm> {
    return this.exemploRepository.findOneEntityById(id);
  }

  public updateEntity<T>(
    id: number,
    updateEntityDto: UpdateExemploDto,
    actionDoneBy?: T,
  ): Promise<ExemploTypeOrm> {
    return this.update(
      { id, ...updateEntityDto } as Partial<CreateExemploDto>,
      actionDoneBy['id'],
      ActionAuditEnum.UPDATE,
    );
  }

  public removeEntity<T>(id: number, actionDoneBy?: T): Promise<void> {
    return this.exemploRepository.softDelete(
      { id } as Partial<CreateExemploDto>,
      actionDoneBy['id'],
    );
  }
}
