import { Injectable } from '@nestjs/common';

import { Exemplo } from './entities/exemplo.entity';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { EntityId } from '../core/architecture/types/enity-id.type';
import { getRepository } from './repository/repository';
import { ActionAuditEnum } from './../core/architecture/enums/action-audit.enum';
import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';
import { IExemploService } from './interfaces/exemplo-service.interface';

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
  constructor() {
    super(getRepository());
  }

  public createEntity(
    createEntityDto: CreateExemploDto,
    actionDoneBy?: Express.User,
  ): Promise<Exemplo> {
    return this.createEntity(createEntityDto, actionDoneBy['id']);
  }

  public findAllEntity(): Promise<Exemplo[]> {
    return this.find();
  }

  public findOneEntity(id?: number, options?: object): Promise<Exemplo> {
    const optionsQuery = !!id ? { where: { id } } : options;

    return this.findOne(optionsQuery);
  }

  public updateEntity(
    id: number,
    updateEntityDto: UpdateExemploDto,
    actionDoneBy?: Express.User,
  ): Promise<Exemplo> {
    return this.update(
      { id: +id, ...updateEntityDto } as Partial<CreateExemploDto>,
      actionDoneBy['id'],
      ActionAuditEnum.UPDATE,
    );
  }

  public removeEntity(id: number, actionDoneBy?: Express.User): Promise<void> {
    return this.softDelete(
      {
        where: { id },
      },
      actionDoneBy['id'],
    );
  }
}
