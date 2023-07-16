import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Exemplo } from './entities/exemplo.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { EntityId } from './../core/architecture/types/enity-id';
import { ExemploRepositoryWithAudit } from './repository/repository';
import { ActionAuditEnum } from './../core/architecture/enums/action-audit.enum';
import { CrudWithAuditService } from 'src/core/architecture/services/crud-with-audit.service';

@Injectable()
export class ExemploService extends CrudWithAuditService<
  Exemplo,
  ExemploAudit,
  EntityId,
  CreateExemploDto
> {
  constructor(
    @InjectRepository(Exemplo)
    entityRepository: Repository<Exemplo>,
    @InjectRepository(ExemploAudit)
    auditRepository: Repository<ExemploAudit>,
  ) {
    super(
      ExemploRepositoryWithAudit.createInstance(
        entityRepository,
        auditRepository,
      ),
    );
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

  public findOneEntity(
    id?: number,
    options?: FindOneOptions<Exemplo>,
  ): Promise<Exemplo> {
    const optionsQuery = (
      !!id ? { where: { id } } : options
    ) as FindOneOptions<Exemplo>;

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
