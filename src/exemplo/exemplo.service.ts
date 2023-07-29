import { Injectable } from '@nestjs/common';

import { Exemplo } from './entities/exemplo';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';
import { EntityId } from '../core/architecture/types/enity-id.type';
import { IExemploService } from './interfaces/exemplo-service.interface';
import { IExemploRepository } from './interfaces/exemplo-repository.interface';
import { ActionAuditEnum } from './../core/architecture/enums/action-audit.enum';
import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';
import { ExemploAudit } from './entities/exemplo-audit';

@Injectable()
export class ExemploService
  extends CrudWithAuditService<
    Exemplo,
    ExemploAudit,
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
  ): Promise<Exemplo> {
    return this.createEntity(createEntityDto, actionDoneBy['id']);
  }

  public findAllEntity(): Promise<Exemplo[]> {
    return this.find();
  }

  public findOneEntityById(id: number): Promise<Exemplo> {
    return this.exemploRepository.findOneEntityById(id);
  }

  public updateEntity<T>(
    id: number,
    updateEntityDto: UpdateExemploDto,
    actionDoneBy?: T,
  ): Promise<Exemplo> {
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
