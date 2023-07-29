import { Injectable } from '@nestjs/common';

import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';
import { ExemploTypeOrm } from './entities/typeorm/exemplo.entity';
import { EntityId } from '../core/architecture/types/enity-id.type';
import { ExemploAuditTypeOrm } from './entities/typeorm/exemplo-audit.sentity';
import { IExemploService } from './interfaces/exemplo-service.interface';
import { ActionAuditEnum } from './../core/architecture/enums/action-audit.enum';
import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';
import { IExemploRepository } from './interfaces/exemplo-repository.interface';

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

  public createEntity(
    createEntityDto: CreateExemploDto,
    actionDoneBy?: Express.User,
  ): Promise<ExemploTypeOrm> {
    return this.createEntity(createEntityDto, actionDoneBy['id']);
  }

  public findAllEntity(): Promise<ExemploTypeOrm[]> {
    return this.find();
  }

  public findOneEntity(id?: number, options?: object): Promise<ExemploTypeOrm> {
    const optionsQuery = !!id ? { where: { id } } : options;

    return this.findOne(optionsQuery);
  }

  public updateEntity(
    id: number,
    updateEntityDto: UpdateExemploDto,
    actionDoneBy?: Express.User,
  ): Promise<ExemploTypeOrm> {
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
